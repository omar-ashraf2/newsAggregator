/**
 * router.ts
 *
 * Single Responsibility:
 *  - Defines the application’s routes and nested routes.
 */

import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ArticleDetail from "./pages/ArticleDetail";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "article/:id", element: <ArticleDetail /> },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
