const conf= {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteCommentsCollectionId: String(import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID || ""),
    appwriteVotesCollectionId: String(import.meta.env.VITE_APPWRITE_VOTES_COLLECTION_ID || ""),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    tinykey:String(import.meta.env.VITE_TINYMCE_API_KEY),
    sentryDSN:String(import.meta.env.VITE_SENTRY_DSN),
}

export default conf