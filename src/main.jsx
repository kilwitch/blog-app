import "./instrument.js"; // MUST be the first import

import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";
import store from "./store/store.js";



import { AuthLayout } from "./components/index.js";
import ErrorPage from "./pages/ErrorPage.jsx";

const Home = React.lazy(() => import("./pages/Home.jsx"));
const Login = React.lazy(() => import("./pages/Login.jsx"));
const Signup = React.lazy(() => import("./pages/Signup.jsx"));
const AllPosts = React.lazy(() => import("./pages/AllPosts.jsx"));
const AddPost = React.lazy(() => import("./pages/AddPost.jsx"));
const EditPost = React.lazy(() => import("./pages/EditPost.jsx"));
const Post = React.lazy(() => import("./pages/Post.jsx"));
const MyPosts= React.lazy(()=>import('./pages/MyPosts.jsx'));
const Dashboard = React.lazy(() => import("./pages/Dashboard.jsx"));

const NotFound = React.lazy(() => import("./pages/NotFound.jsx"));

const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouterV6(createBrowserRouter);

const router = sentryCreateBrowserRouter([
  
  {
    path: "/",
    element: <App />, 
    errorElement: <ErrorPage/>,
    children: [
      { path: "", element: <Home /> },
      { path: "*", element: <NotFound /> },
      {
        path: "dashboard",
        element: (
          <AuthLayout authentication>
            <Dashboard />
          </AuthLayout>
        ),
      },
      {
        path: "login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },

      {
        path: "signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },

      {
        path: "all-posts",
        element: (
          <AuthLayout authentication>
            <AllPosts />
          </AuthLayout>
        ),
      },
      {
        path: "my-posts",
        element: (
          <AuthLayout authentication>
            <MyPosts />
          </AuthLayout>
        ),
      },

      {
        path: "add-post",
        element: (
          <AuthLayout authentication>
            <AddPost />
          </AuthLayout>
        ),
      },

      {
        path: "edit-post/:slug",
        element: (
          <AuthLayout authentication>
            <EditPost />
          </AuthLayout>
        ),
      },

      {
        path: "post/:slug",
        element: <Post />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root"), {
  onUncaughtError: Sentry.reactErrorHandler(),
  onCaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
}).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<p>An unexpected error occurred</p>}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);