import conf from '../conf/conf.js'
import { Client, Databases, ID, Query } from "appwrite"
import * as Sentry from "@sentry/react"

export class CommentService {
    client = new Client()
    databases

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        this.databases = new Databases(this.client)
    }

    async createComment({ postId, userId, userName, content }) {
        if (!conf.appwriteCommentsCollectionId) {
            const err = new Error("VITE_APPWRITE_COMMENTS_COLLECTION_ID is missing in your .env file. Please create a 'comments' collection in Appwrite and set this environment variable.")
            Sentry.withScope((scope) => {
                scope.setTag("service", "comments");
                scope.setTag("action", "createComment");
                Sentry.captureException(err);
            });
            throw err
        }
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCommentsCollectionId,
                ID.unique(),
                {
                    postId,
                    userId,
                    userName,
                    content,
                }
            )
        } catch (error) {
            Sentry.withScope((scope) => {
                scope.setTag("service", "comments");
                scope.setTag("action", "createComment");
                scope.setExtra("postId", postId);
                scope.setExtra("userId", userId);
                Sentry.captureException(error);
            });
            throw error
        }
    }

    async getComments(postId) {
        if (!conf.appwriteCommentsCollectionId) {
            return false
        }
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCommentsCollectionId,
                [
                    Query.equal("postId", postId),
                    Query.orderDesc("$createdAt")
                ]
            )
        } catch (error) {
            Sentry.withScope((scope) => {
                scope.setTag("service", "comments");
                scope.setTag("action", "getComments");
                scope.setExtra("postId", postId);
                Sentry.captureException(error);
            });
            return false
        }
    }

    async deleteComment(commentId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCommentsCollectionId,
                commentId
            )
            return true
        } catch (error) {
            Sentry.withScope((scope) => {
                scope.setTag("service", "comments");
                scope.setTag("action", "deleteComment");
                scope.setExtra("commentId", commentId);
                Sentry.captureException(error);
            });
            return false
        }
    }
}

const commentService = new CommentService()
export default commentService
