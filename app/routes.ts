import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("services", "routes/services.tsx"),
  route("bio", "routes/bio.tsx"),
  route("contact", "routes/contact.tsx"),
  route("store", "routes/store.tsx"),
  route("store/:productId", "routes/store/product.tsx"),
  route("cart", "routes/cart.tsx"),
  route("checkout", "routes/checkout.tsx"),
  route("checkout/success", "routes/checkout/success.tsx"),
  
  // Authentication routes
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  
  // Account routes
  route("account", "routes/account/index.tsx"),
  route("account/orders", "routes/account/orders.tsx"),
  
  // Admin routes
  route("admin", "routes/admin/index.tsx"),
  route("admin/products", "routes/admin/products.tsx"),
  route("admin/products/new", "routes/admin/products/new.tsx"),
  route("admin/products/:productId", "routes/admin/products/edit.tsx"),
  route("admin/orders", "routes/admin/orders.tsx"),
  route("admin/customers", "routes/admin/customers.tsx"),
  route("admin/settings", "routes/admin/settings.tsx"),
] satisfies RouteConfig;
