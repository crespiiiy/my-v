import React from "react";

export function meta() {
  return [
    { title: "Privacy Policy - Creative" },
    { name: "description", content: "Privacy Policy for Creative e-commerce store." },
  ];
}

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-300">
            Creative ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, including any other media form, media channel, mobile website, or mobile application related or connected to Creative (collectively, the "Site").
          </p>
          <p className="text-gray-300 mt-4">
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-medium mb-3">Personal Data</h3>
          <p className="text-gray-300">
            Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards. You are under no obligation to provide us with personal information of any kind, however your refusal to do so may prevent you from using certain features of the Site.
          </p>
          
          <h3 className="text-xl font-medium mb-3 mt-4">Derivative Data</h3>
          <p className="text-gray-300">
            Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
          </p>
          
          <h3 className="text-xl font-medium mb-3 mt-4">Financial Data</h3>
          <p className="text-gray-300">
            Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site. We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor, [Payment Processor Name], and you are encouraged to review their privacy policy and contact them directly for responses to your questions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-300">
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
            <li>Create and manage your account.</li>
            <li>Process your orders and manage your payments.</li>
            <li>Send you a newsletter or marketing communication.</li>
            <li>Email you regarding your account or order.</li>
            <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
            <li>Increase the efficiency and operation of the Site.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
            <li>Notify you of updates to the Site.</li>
            <li>Request feedback and contact you about your use of the Site.</li>
            <li>Resolve disputes and troubleshoot problems.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Disclosure of Your Information</h2>
          <p className="text-gray-300">
            We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
          </p>

          <h3 className="text-xl font-medium mb-3 mt-4">By Law or to Protect Rights</h3>
          <p className="text-gray-300">
            If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
          </p>

          <h3 className="text-xl font-medium mb-3 mt-4">Third-Party Service Providers</h3>
          <p className="text-gray-300">
            We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
          </p>

          <h3 className="text-xl font-medium mb-3 mt-4">Marketing Communications</h3>
          <p className="text-gray-300">
            With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Security of Your Information</h2>
          <p className="text-gray-300">
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="text-gray-300">
            If you have questions or comments about this Privacy Policy, please contact us at:
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