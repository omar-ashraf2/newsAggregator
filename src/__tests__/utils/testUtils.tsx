import { articlesApi } from "@/features/articles/articlesApi";
import filterReducer from "@/features/filters/filterSlice";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

export const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: {
      filters: filterReducer,
      [articlesApi.reducerPath]: articlesApi.reducer,
    },
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(articlesApi.middleware),
  });

export const renderWithProviders = (ui: React.ReactNode, initialState = {}) => {
  const store = createMockStore(initialState);

  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};
