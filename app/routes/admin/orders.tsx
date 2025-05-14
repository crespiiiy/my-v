import type { Route } from "./+types/orders";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Orders - Creative Admin" },
    { name: "description", content: "Manage customer orders" },
  ];
}

export default function Orders() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>
      
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400 mb-4">Orders management will be implemented in a future update.</p>
        <p>Stay tuned for new features!</p>
      </div>
    </div>
  );
} 