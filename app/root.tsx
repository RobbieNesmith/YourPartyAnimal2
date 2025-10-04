import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  useParams,
} from "@remix-run/react";

import "./app.css";
import { Button, Stack } from "@mui/material";
import ErrorDisplay from "./components/ErrorDisplay";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorDisplay error={error.data} />
    );
  } else if (error instanceof Error) {
    return (
      <ErrorDisplay error={{title: "Error", message: error.message}} />
    );
  } else {
    return <ErrorDisplay error={{title: "Unknown Error", message: "Something went wrong."}} />;
  }
}