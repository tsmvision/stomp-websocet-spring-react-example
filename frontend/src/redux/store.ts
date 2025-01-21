import { configureStore } from '@reduxjs/toolkit'
import {stompApi} from "./api/stompApi.ts";
import {stompConnectionSlice} from "./stompConnectionStatus.ts";

export const store = configureStore({
    reducer: {
        'stompConnectionStatus': stompConnectionSlice.reducer,
        [stompApi.reducerPath]: stompApi.reducer,
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(stompApi.middleware),
    devTools: true,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
