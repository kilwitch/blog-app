import conf from '../conf/conf.js';
import {Client, Account, ID} from "appwrite"
import * as Sentry from "@sentry/react";

export class AuthService {
    client =new Client();
    account;

    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.account=new Account(this.client)
    }

    async  createAccount({email, password, name}){
        const userAccount= await this.account.create(
            ID.unique(), email, password, name);
        if(userAccount){
            // call another method
            return this.login({email, password});
        }else{
            return userAccount;
        }
    }

    async login({email, password}){
    try {
        // Delete existing session first if any
        try {
            await this.account.deleteSession('current')
        } catch {
            // No active session, ignore error
        }
        return await this.account.createEmailSession(email, password)
    } catch (error) {
        Sentry.withScope((scope)=>{
            scope.setTag('location','Appwrite:: login');
            Sentry.captureException(error);
        })
        throw error
    }
}

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            Sentry.withScope((scope)=>{
            scope.setTag('location','Appwrite service :: getCurrentUser :: error');
            Sentry.captureException(error);
        })
            throw error;
        }

        return null;
    }

    async logout(){
        try {
            await this.account.deleteSessions()
        } catch (error) {
            Sentry.withScope((scope)=>{
            scope.setTag('location','Appwrite service :: logout :: error');
            Sentry.captureException(error);
        })
           
            
        }
    }
}

const authService= new AuthService();

export default authService;

