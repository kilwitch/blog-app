import { configureStore } from '@reduxjs/toolkit';
import * as Sentry from "@sentry/react";
import authSlice from './authSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        //TODO: add more slices here for posts
    },
    enhancers: (getDefaultEnhancers) =>
        getDefaultEnhancers().concat(Sentry.createReduxEnhancer()),
});

export default store;