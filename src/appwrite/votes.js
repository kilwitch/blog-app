import conf from '../conf/conf.js'
import { Client, Databases, ID, Query } from "appwrite"
import * as Sentry from "@sentry/react"

export class VoteService {
    client = new Client()
    databases

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        this.databases = new Databases(this.client)
    }

    get collectionId() {
        // Fallback to comments collection if votes collection not set yet
        return conf.appwriteVotesCollectionId || conf.appwriteCommentsCollectionId || conf.appwriteCollectionId
    }

    async getPostVotes(postId, userId = null) {
        if (!this.collectionId) {
            return { upvotes: 0, downvotes: 0, userVote: null }
        }

        try {
            const res = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                this.collectionId,
                [Query.equal("postId", postId)]
            )

            if (!res || !res.documents) {
                return { upvotes: 0, downvotes: 0, userVote: null }
            }

            let upvotes = 0
            let downvotes = 0
            let userVote = null

            res.documents.forEach((doc) => {
                if (doc.voteType === "up") upvotes++
                else if (doc.voteType === "down") downvotes++

                if (userId && doc.userId === userId) {
                    userVote = doc.voteType
                }
            })

            return { upvotes, downvotes, userVote }
        } catch (error) {
            Sentry.withScope((scope) => {
                scope.setTag("service", "votes")
                scope.setTag("action", "getPostVotes")
                scope.setExtra("postId", postId)
                Sentry.captureException(error)
            })
            return { upvotes: 0, downvotes: 0, userVote: null }
        }
    }

    async castVote({ postId, userId, voteType }) {
        if (!this.collectionId) {
            throw new Error("Appwrite Votes Collection ID is not configured.")
        }

        try {
            // Find if user already voted on this post
            const existingVotes = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                this.collectionId,
                [
                    Query.equal("postId", postId),
                    Query.equal("userId", userId)
                ]
            )

            const existingDoc = existingVotes?.documents?.[0]

            if (existingDoc) {
                if (existingDoc.voteType === voteType) {
                    // Toggle off (remove vote)
                    await this.databases.deleteDocument(
                        conf.appwriteDatabaseId,
                        this.collectionId,
                        existingDoc.$id
                    )
                } else {
                    // Switch vote type (e.g. up -> down or down -> up)
                    await this.databases.updateDocument(
                        conf.appwriteDatabaseId,
                        this.collectionId,
                        existingDoc.$id,
                        { voteType }
                    )
                }
            } else {
                // Create new vote
                await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    this.collectionId,
                    ID.unique(),
                    {
                        postId,
                        userId,
                        voteType
                    }
                )
            }

            return await this.getPostVotes(postId, userId)
        } catch (error) {
            Sentry.withScope((scope) => {
                scope.setTag("service", "votes")
                scope.setTag("action", "castVote")
                scope.setExtra("postId", postId)
                scope.setExtra("userId", userId)
                scope.setExtra("voteType", voteType)
                Sentry.captureException(error)
            })
            throw error
        }
    }
}

const voteService = new VoteService()
export default voteService
