import type { RouteObject } from "react-router-dom";
import React from "react";
import { ErrorBoundary, ErrorFallback } from "./components/ErrorBoundary";

// Explicitly import the wishlist component to ensure it exists
import WishlistPage from "./routes/wishlist";

// Log component loading
console.log('Loading routes configuration...');

// Map of component paths to import functions to avoid dynamic string evaluation
const componentImports: Record<string, () => Promise<any>> = {
  "routes/home": () => {
    console.log('Loading home component...');
    return import("./routes/home").catch(err => {
      console.error('Error loading home component:', err);
      throw err;
    });
  },
  "routes/services": () => import("./routes/services"),
  "routes/bio": () => import("./routes/bio"),
  "routes/contact": () => import("./routes/contact"),
  "routes/store": () => import("./routes/store"),
  "routes/store/product": () => import("./routes/store/product"),
  "routes/cart": () => import("./routes/cart"),
  "routes/wishlist": () => {
    console.log('Loading wishlist component...');
    return import("./routes/wishlist").catch(err => {
      console.error('Error loading wishlist component:', err);
      throw err;
    });
  },
  "routes/checkout": () => import("./routes/checkout"),
  "routes/checkout/success": () => import("./routes/checkout/success"),
  "routes/login": () => import("./routes/login"),
  "routes/register": () => import("./routes/register"),
  "routes/account/index": () => import("./routes/account/index"),
  "routes/account/orders": () => import("./routes/account/orders"),
  "routes/admin/index": () => import("./routes/admin/index"),
  "routes/admin/products": () => import("./routes/admin/products"),
  "routes/admin/products/new": () => import("./routes/admin/products/new"),
  "routes/admin/products/edit": () => import("./routes/admin/products/edit"),
  "routes/admin/orders": () => import("./routes/admin/orders"),
  "routes/admin/customers": () => import("./routes/admin/customers"),
  "routes/admin/settings": () => import("./routes/admin/settings"),
  "routes/privacy-policy": () => import("./routes/privacy-policy"),
  "routes/terms-of-service": () => import("./routes/terms-of-service"),
  "routes/refund-policy": () => import("./routes/refund-policy"),
};

// Helper function to create route objects with component import
const createRoute = (path: string, componentPath: string): RouteObject => ({
  path,
  async lazy() {
    try {
      console.log(`Loading component for path: ${path}, component: ${componentPath}`);
      
      // Check if component path exists in our map
      if (!(componentPath in componentImports)) {
        console.error(`No import function for ${componentPath}`);
        throw new Error(`No import function for ${componentPath}`);
      }
      
      // Dynamic import using the map
      const module = await componentImports[componentPath]();
      console.log(`Successfully loaded component for path: ${path}`);
      return { Component: module.default };
    } catch (error) {
      console.error(`Error loading route component: ${componentPath}`, error);
      return { 
        Component: () => {
          console.log(`Rendering error fallback for ${componentPath}`);
          return <ErrorFallback />;
        }
      };
    }
  }
});

// Special route for wishlist to avoid dynamic import issues
const wishlistRoute = {
  path: "wishlist",
  element: <WishlistPage />
};

const rootRoute = {
  path: "/", 
  async lazy() {
    try {
      console.log('Loading root component...');
      const module = await import("./root");
      console.log('Root component loaded successfully');
      return { Component: module.default };
    } catch (error) {
      console.error("Error loading root component", error);
      return { Component: ErrorBoundary };
    }
  },
  errorElement: <ErrorBoundary />,
  children: [
    createRoute("", "routes/home"),
    createRoute("services", "routes/services"),
    createRoute("bio", "routes/bio"),
    createRoute("contact", "routes/contact"),
    createRoute("store", "routes/store"),
    createRoute("store/:productId", "routes/store/product"),
    createRoute("cart", "routes/cart"),
    wishlistRoute, // Use the statically imported route
    createRoute("checkout", "routes/checkout"),
    createRoute("checkout/success", "routes/checkout/success"),
    
    // Authentication routes
    createRoute("login", "routes/login"),
    createRoute("register", "routes/register"),
    
    // Account routes
    createRoute("account", "routes/account/index"),
    createRoute("account/orders", "routes/account/orders"),
    
    // Legal/Policy routes
    createRoute("privacy-policy", "routes/privacy-policy"),
    createRoute("terms-of-service", "routes/terms-of-service"),
    createRoute("refund-policy", "routes/refund-policy"),
    
    // Admin routes
    createRoute("admin", "routes/admin/index"),
    createRoute("admin/products", "routes/admin/products"),
    createRoute("admin/products/new", "routes/admin/products/new"),
    createRoute("admin/products/:productId", "routes/admin/products/edit"),
    createRoute("admin/orders", "routes/admin/orders"),
    createRoute("admin/customers", "routes/admin/customers"),
    createRoute("admin/settings", "routes/admin/settings"),
  ]
};

const routes: RouteObject[] = [rootRoute];

console.log('Routes configuration loaded successfully');

export default routes; 