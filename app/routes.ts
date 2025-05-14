import type { RouteObject } from "react-router-dom";

// Helper function to create route objects with component import
const createRoute = (path: string, componentPath: string): RouteObject => ({
  path,
  async lazy() {
    // Dynamic import of the component
    const module = await import(`./${componentPath}`);
    return { Component: module.default };
  }
});

const routes: RouteObject[] = [
  { 
    path: "/", 
    async lazy() {
      const module = await import("./root");
      return { Component: module.default };
    },
    children: [
      createRoute("", "routes/home"),
      createRoute("services", "routes/services"),
      createRoute("bio", "routes/bio"),
      createRoute("contact", "routes/contact"),
      createRoute("store", "routes/store"),
      createRoute("store/:productId", "routes/store/product"),
      createRoute("cart", "routes/cart"),
      createRoute("checkout", "routes/checkout"),
      createRoute("checkout/success", "routes/checkout/success"),
      
      // Authentication routes
      createRoute("login", "routes/login"),
      createRoute("register", "routes/register"),
      
      // Account routes
      createRoute("account", "routes/account/index"),
      createRoute("account/orders", "routes/account/orders"),
      
      // Admin routes
      createRoute("admin", "routes/admin/index"),
      createRoute("admin/products", "routes/admin/products"),
      createRoute("admin/products/new", "routes/admin/products/new"),
      createRoute("admin/products/:productId", "routes/admin/products/edit"),
      createRoute("admin/orders", "routes/admin/orders"),
      createRoute("admin/customers", "routes/admin/customers"),
      createRoute("admin/settings", "routes/admin/settings"),
    ]
  }
];

export default routes;
