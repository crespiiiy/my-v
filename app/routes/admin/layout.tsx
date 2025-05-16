import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminLayout() {
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  // إنشاء قائمة الروابط الأساسية
  const navLinks = [
    { name: "Dashboard", path: "/admin" },
    { name: "Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Customers", path: "/admin/customers" },
    { name: "Store Settings", path: "/admin/settings" },
    { name: "Sync Products", path: "/admin/sync-products" },
  ];

  // إضافة رابط إعدادات المسؤول فقط للمسؤولين
  if (isAdmin) {
    navLinks.push({ name: "Admin Tools", path: "/admin/admin-settings" });
  }

  return (
    <div>
      <div className="bg-gray-900 border-b border-gray-800 py-4 px-6 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Creative Admin</h1>
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            View Store
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg overflow-hidden sticky top-24">
              <nav className="p-2">
                <ul className="space-y-1">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className={`block px-4 py-2 rounded-md transition-colors ${
                          location.pathname === link.path
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-700"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              
              <div className="border-t border-gray-700 p-4 mt-4">
                <Link
                  to="/admin/products/new"
                  className="block bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors w-full text-center"
                >
                  Add New Product
                </Link>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
} 