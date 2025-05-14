import type { Route } from "./+types/settings";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings - Creative Admin" },
    { name: "description", content: "Store settings" },
  ];
}

export default function Settings() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400 mb-4">Store settings will be implemented in a future update.</p>
        <p>Stay tuned for new features!</p>
      </div>
    </div>
  );
} 