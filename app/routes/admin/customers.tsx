import type { Route } from "./+types/customers";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Customers - Creative Admin" },
    { name: "description", content: "Manage customers" },
  ];
}

export default function Customers() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Customers</h1>
      
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400 mb-4">Customer management will be implemented in a future update.</p>
        <p>Stay tuned for new features!</p>
      </div>
    </div>
  );
} 