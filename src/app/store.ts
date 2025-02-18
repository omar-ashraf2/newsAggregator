/**
 * store.ts
 *
 * Sets up Redux Toolkit store with:
 *  - Combined reducers (filters + RTK Query `articlesApi`)
 *  - Redux Persist configuration for saving certain slices (e.g. filters)
 *  - Middlewares (RTK Query, default middlewares)
 */

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import { articlesApi } from "@/features/articles/articlesApi";
import filterReducer from "@/features/filters/filterSlice";

const rootReducer = combineReducers({
  filters: filterReducer,
  [articlesApi.reducerPath]: articlesApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["filters"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // We must ignore these actions for redux-persist to function
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(articlesApi.middleware),
});

// Creates a persistor to manage the rehydration process
export const persistor = persistStore(store);

// Infer RootState and AppDispatch for typed usage in the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
