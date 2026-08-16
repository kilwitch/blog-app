import conf from '../conf/conf.js'
import { Client, Databases, ID, Storage, Query } from "appwrite"
import * as Sentry from "@sentry/react"
import { redisCache } from '../services/redisService.js'

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        Sentry.addBreadcrumb({
            category: "appwrite",
            message: `Appwrite initialized with endpoint ${conf.appwriteUrl}`,
            level: "info"
        });
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredImage, status, userId, authorName, tags = [] }) {
        try {
            const docData = {
                title,
                content,
                featuredImage,
                status,
                userid: userId,
                tags,
            };
            if (authorName) docData.authorName = authorName;

            const newPost = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                docData
            );

            // Invalidate post cache on creation
            await redisCache.del(`inkflow:post:${slug}`);
            await redisCache.del(`inkflow:posts:[{"key":"status","values":["active"]}]`);

            return newPost;
        } catch (error) {
            if (error?.message?.includes('authorName') || error?.code === 400) {
                try {
                    const fallbackPost = await this.databases.createDocument(
                        conf.appwriteDatabaseId,
                        conf.appwriteCollectionId,
                        slug,
                        { title, content, featuredImage, status, userid: userId, tags }
                    );

                    await redisCache.del(`inkflow:post:${slug}`);
                    await redisCache.del(`inkflow:posts:[{"key":"status","values":["active"]}]`);

                    return fallbackPost;
                } catch (retryError) {
                    Sentry.withScope((scope) => {
                        scope.setTag("location", "Appwrite :: createPost :: retry error");
                        Sentry.captureException(retryError);
                    });
                    throw retryError;
                }
            }
            Sentry.withScope((scope) => {
                scope.setTag("location", "Appwrite :: createPost :: error");
                Sentry.captureException(error);
            });

            throw error;
        }
    }

    async updatePost(slug, { title, content, featuredImage, status, authorName, tags = [] }) {
        try {
            const docData = {
                title,
                content,
                featuredImage,
                status,
                tags,
            };
            if (authorName) docData.authorName = authorName;

            const updatedPost = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                docData
            );

            // Invalidate single post & post list cache
            await redisCache.del(`inkflow:post:${slug}`);
            await redisCache.del(`inkflow:posts:[{"key":"status","values":["active"]}]`);

            return updatedPost;
        } catch (error) {
            if (error?.message?.includes('authorName') || error?.code === 400) {
                try {
                    const fallbackPost = await this.databases.updateDocument(
                        conf.appwriteDatabaseId,
                        conf.appwriteCollectionId,
                        slug,
                        { title, content, featuredImage, status, tags }
                    );

                    await redisCache.del(`inkflow:post:${slug}`);
                    await redisCache.del(`inkflow:posts:[{"key":"status","values":["active"]}]`);

                    return fallbackPost;
                } catch (retryError) {
                    Sentry.withScope((scope) => {
                        scope.setTag("location", "Appwrite :: updatePost :: retry error");
                        Sentry.captureException(retryError);
                    });
                    throw retryError;
                }
            }
            Sentry.withScope((scope) => {
                scope.setTag("location", "Appwrite :: updatePost :: error");
                Sentry.captureException(error);
            });

            throw error;
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            );

            // Invalidate single post & post list cache
            await redisCache.del(`inkflow:post:${slug}`);
            await redisCache.del(`inkflow:posts:[{"key":"status","values":["active"]}]`);

            return true;
        } catch (error) {
            Sentry.withScope((scope) => {
                scope.setTag("location", "Appwrite :: deletePost :: error");
                Sentry.captureException(error);
            });

            return false;
        }
    }

    async getPost(slug) {
        const cacheKey = `inkflow:post:${slug}`;

        try {
            // 1. Try reading from Redis cache first
            const cachedPost = await redisCache.get(cacheKey);
            if (cachedPost) {
                try {
                    return typeof cachedPost === 'string' ? JSON.parse(cachedPost) : cachedPost;
                } catch {
                    return cachedPost;
                }
            }

            // 2. Database fetch on cache miss
            const post = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            );

            if (post) {
                await redisCache.set(cacheKey, post, 300); // Cache for 5 mins
            }

            return post;
        } catch (error) {
            Sentry.withScope((scope) => {
                scope.setTag("location", "Appwrite :: getPost :: error");
                Sentry.captureException(error);
            });

            throw error;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        const cacheKey = `inkflow:posts:${JSON.stringify(queries)}`;

        try {
            // 1. Check Redis cache first
            const cachedPosts = await redisCache.get(cacheKey);
            if (cachedPosts) {
                try {
                    return typeof cachedPosts === 'string' ? JSON.parse(cachedPosts) : cachedPosts;
                } catch {
                    return cachedPosts;
                }
            }

            // 2. Appwrite Database fetch
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            );

            if (response) {
                await redisCache.set(cacheKey, response, 60); // Cache active feed for 60s
            }

            return response;
        } catch (error) {
            // Fallback: If query failed (e.g. missing composite index for orderDesc), retry without orderDesc
            const fallbackQueries = queries.filter(q => {
                const qStr = typeof q === 'string' ? q : JSON.stringify(q);
                return !qStr.includes('order');
            });
            if (fallbackQueries.length < queries.length) {
                try {
                    const fallbackResponse = await this.databases.listDocuments(
                        conf.appwriteDatabaseId,
                        conf.appwriteCollectionId,
                        fallbackQueries
                    );
                    return fallbackResponse;
                } catch (fallbackError) {
                    Sentry.withScope((scope) => {
                        scope.setTag("location", "Appwrite :: getPosts fallback error:");
                        Sentry.captureException(fallbackError);
                    });
                }
            }

            Sentry.withScope((scope) => {
                scope.setTag("location", "Appwrite :: getPosts:: error");
                Sentry.captureException(error);
            });
            return false;
        }
    }

    // File upload service
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
            );
        } catch (error) {
            Sentry.withScope((scope) => {
                scope.setTag("location", "Appwrite :: uploadFile:: error");
                Sentry.captureException(error);
            });

            throw error;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId,
            );
            return true;
        } catch (error) {
            Sentry.withScope((scope) => {
                scope.setTag("location", "Appwrite :: deleteFile:: error");
                Sentry.captureException(error);
            });

            return false;
        }
    }

    getFilePreview(fileId) {
        return this.bucket.getFileView(
            conf.appwriteBucketId,
            fileId,
        );
    }
}

const service = new Service();
export default service;