import { articlesApi } from "@/features/articles/articlesApi";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    // Add the RTK Query API reducer
    [articlesApi.reducerPath]: articlesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    // Add the RTK Query middleware for caching, invalidation, etc.
    getDefaultMiddleware().concat(articlesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
