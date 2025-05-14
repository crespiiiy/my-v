import {
  isRouteErrorResponse,
  Link,
  Outlet,
  ScrollRestoration,
  useRouteError
} from "react-router-dom";
import { Helmet } from "react-helmet";

import "./app.css";
import SiteLayout from "./components/Layout";
import AnalyticsAndSecurity from "./components/AnalyticsAndSecurity";

// Define Route types inline since +types directory doesn't exist
namespace Route {
  export interface LinksFunction {
    (): Array<{ rel: string; href: string; crossOrigin?: string }>;
  }
  
  export interface ErrorBoundaryProps {
    error: unknown;
  }
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Custom script to fix hydration mismatch
export const DocumentHydrationFix = () => {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // This script ensures that any browser extension or third-party script
            // that's adding the 'mdl-js' class won't cause hydration mismatches
            window.addEventListener('DOMContentLoaded', () => {
              // If any extension added classes, normalize it back to just 'dark'
              document.documentElement.className = 'dark';
            });
          `,
        }}
      />
    </>
  );
};

export function RootLayout({ children }: { children: React.ReactNode }) {
  console.log('Rendering Layout component');
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Helmet>
          <title>Creative - Creative Digital Products</title>
          <meta name="description" content="Creative digital products for creative professionals" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
        </Helmet>
        <DocumentHydrationFix />
      </head>
      <body>
            {children}
        <ScrollRestoration />
      </body>
    </html>
  );
}

export default function App() {
  console.log('Rendering App component');
  return (
    <SiteLayout>
      <Outlet />
      <AnalyticsAndSecurity 
        googleAnalyticsId={process.env.REACT_APP_GA_ID}
        facebookPixelId={process.env.REACT_APP_FB_PIXEL_ID}
      />
    </SiteLayout>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error('Root ErrorBoundary caught an error:', error);
  
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
    console.error(`Route error: ${error.status} - ${error.statusText || 'Unknown error'}`);
  } else if (error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
    console.error('Error details:', error.message, error.stack);
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto text-sm text-gray-400 bg-gray-800 rounded">
          <code>{stack}</code>
        </pre>
      )}
      <Link
        to="/"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
      >
        Go to Home Page
      </Link>
    </main>
  );
}
