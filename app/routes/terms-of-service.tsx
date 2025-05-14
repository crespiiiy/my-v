import React from "react";

export function meta() {
  return [
    { title: "Terms of Service - Creative" },
    { name: "description", content: "Terms of Service for Creative e-commerce store." },
  ];
}

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p className="text-gray-300">
            By accessing our website, Creative, you are agreeing to be bound by these Terms of Service and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this website are protected by copyright and trade mark law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="text-gray-300">
            Permission is granted to temporarily download one copy of the materials on Creative's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose or for any public display;</li>
            <li>Attempt to reverse engineer any software contained on Creative's website;</li>
            <li>Remove any copyright or other proprietary notations from the materials; or</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          <p className="text-gray-300 mt-4">
            This license shall automatically terminate if you violate any of these restrictions and may be terminated by Creative at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
          <p className="text-gray-300">
            All the materials on Creative's website are provided "as is". Creative makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, Creative does not make any representations concerning the accuracy or reliability of the use of the materials on its website or otherwise relating to such materials or any sites linked to this website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
          <p className="text-gray-300">
            Creative or its suppliers will not be held accountable for any damages that may arise with the use or inability to use the materials on Creative's website, even if Creative or an authorized representative of this website has been notified, orally or written, of the possibility of such damage. Some jurisdictions do not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Revisions and Errata</h2>
          <p className="text-gray-300">
            The materials appearing on Creative's website may include technical, typographical, or photographic errors. Creative will not promise that any of the materials in this website are accurate, complete, or current. Creative may change the materials contained on its website at any time without notice. Creative does not make any commitment to update the materials.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Links</h2>
          <p className="text-gray-300">
            Creative has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by Creative of the site. The use of any linked website is at the user's own risk.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Site Terms of Use Modifications</h2>
          <p className="text-gray-300">
            Creative may revise these Terms of Service for its website at any time without prior notice. By using this website, you are agreeing to be bound by the current version of these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
          <p className="text-gray-300">
            Any claim related to Creative's website shall be governed by the laws of Egypt without regards to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
          <p className="text-gray-300">
            If you have any questions about these Terms, please contact us:
          </p>
          <div className="mt-3 text-gray-300">
            <p>Creative</p>
            <p>Email: <a href="mailto:info@creative.com" className="text-blue-400 hover:underline">info@creative.com</a></p>
            <p>Phone: <a href="tel:+201259493602" className="text-blue-400 hover:underline">+20 1259493602</a></p>
          </div>
        </section>
      </div>
    </div>
  );
} 