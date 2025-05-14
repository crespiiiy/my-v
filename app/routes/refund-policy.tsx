import React from "react";

export function meta() {
  return [
    { title: "Refund Policy - Creative" },
    { name: "description", content: "Refund and Return Policy for Creative e-commerce store." },
  ];
}

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Refund & Return Policy</h1>
      <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Returns</h2>
          <p className="text-gray-300">
            Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately, we can't offer you a refund or exchange.
          </p>
          <p className="text-gray-300 mt-4">
            To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
          </p>
          <p className="text-gray-300 mt-4">
            Several types of goods are exempt from being returned. Perishable goods such as food, flowers, newspapers or magazines cannot be returned. We also do not accept products that are intimate or sanitary goods, hazardous materials, or flammable liquids or gases.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Refunds</h2>
          <p className="text-gray-300">
            Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
          </p>
          <p className="text-gray-300 mt-4">
            If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.
          </p>
          
          <h3 className="text-xl font-medium mb-3 mt-4">Late or missing refunds</h3>
          <p className="text-gray-300">
            If you haven't received a refund yet, first check your bank account again.
            Then contact your credit card company, it may take some time before your refund is officially posted.
            Next contact your bank. There is often some processing time before a refund is posted.
            If you've done all of this and you still have not received your refund yet, please contact us at <a href="mailto:info@creative.com" className="text-blue-400 hover:underline">info@creative.com</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Exchanges</h2>
          <p className="text-gray-300">
            We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at <a href="mailto:info@creative.com" className="text-blue-400 hover:underline">info@creative.com</a> and send your item to: Creative Returns Department, Cairo, Egypt.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Shipping</h2>
          <p className="text-gray-300">
            To return your product, you should mail your product to: Creative Returns Department, Cairo, Egypt.
          </p>
          <p className="text-gray-300 mt-4">
            You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
          </p>
          <p className="text-gray-300 mt-4">
            Depending on where you live, the time it may take for your exchanged product to reach you may vary.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Digital Products</h2>
          <p className="text-gray-300">
            We do not issue refunds for digital products once the order is confirmed and the product is delivered. We recommend contacting us for assistance if you experience any issues with your order.
          </p>
          <p className="text-gray-300 mt-4">
            As our digital products are intangible goods that are non-returnable, we are generally unable to offer refunds for purchases. We may make exceptions at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Sale items</h2>
          <p className="text-gray-300">
            Only regular priced items may be refunded. Sale items cannot be refunded.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
          <p className="text-gray-300">
            If you have any questions about our Returns and Refunds Policy, please contact us:
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