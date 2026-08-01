import conf from '../conf/conf.js'
import {Client, Databases,ID,Storage, Query } from "appwrite"
import * as Sentry from "@sentry/react"

export class Service{
    client= new Client();
    databases;
    bucket;

    constructor(){
        Sentry.addBreadcrumb({
            category: "appwrite",
            message: `Appwrite initialized with endpoint ${conf.appwriteUrl}`,
            level: "info"
        });
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases= new Databases(this.client)
        this.bucket= new Storage(this.client);
    }

    async createPost({title, slug, content, featuredImage, status, userId}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userid: userId,
                }
        )
        } catch (error) {
            Sentry.withScope((scope) => {
        scope.setTag("location", "Appwrite :: createPost :: error");
        Sentry.captureException(error);
    });
           
            throw error
        }
    }

    async updatePost(slug,{title, content, featuredImage, status}){
    try {
        return await this.databases.updateDocument(
            conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
        )
    } catch (error) {
        Sentry.withScope((scope) => {
        scope.setTag("location", "Appwrite :: updatePost :: error");
        Sentry.captureException(error);
            });
            
            throw error
        }   
    }
    async deletePost(slug){
        try {
             await this.databases.deleteDocument(
                 conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )
            return true;
        } catch (error) {
            Sentry.withScope((scope) => {
        scope.setTag("location", "Appwrite :: deletePost :: error");
        Sentry.captureException(error);
    });
            
            return false;     
        }
       
    }
    
    async getPost(slug){
        try {
            return await this.databases.getDocument(
                 conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )
        } catch (error) {
            Sentry.withScope((scope) => {
            scope.setTag("location", "Appwrite :: getPost :: error");
            Sentry.captureException(error);
            });
           
            throw error;
        }
    }

    async getPosts(queries= [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,

            )
        } catch (error) {
            Sentry.withScope((scope) => {
            scope.setTag("location", "Appwrite :: getPosts:: error");
            Sentry.captureException(error);
            });
            return false;
        }
    }

    //file upload service
    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
                // [
                //     Permission.read(Role.any()) //this line fixed image visiblity
                // ]
            )
        } catch (error) {
            Sentry.withScope((scope) => {
            scope.setTag("location", "Appwrite :: uploadFile:: error");
            Sentry.captureException(error);
            });
            
            throw error
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId,
            )
            return true;
        } catch (error) {
            Sentry.withScope((scope) => {
            scope.setTag("location", "Appwrite :: deleteFile:: error");
            Sentry.captureException(error);
            });
           
            return false;
        }
        
    }

    getFilePreview(fileId){
            return  this.bucket.getFileView(
                conf.appwriteBucketId,
                fileId,
            )
    }
}   



const service=new Service()

export default service