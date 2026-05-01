import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen body-theme py-10 px-4 sm:px-8 md:px-16 lg:px-32">
      <div className="max-w-4xl mx-auto body-theme shadow-lg rounded-lg p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">1. Introduction</h2>
          <p className="">
            Welcome to <span className="font-semibold">NativeTalk CRM</span> ("Company," "we," "our," or "us"). Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our platform and services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">2. Information We Collect</h2>
          <ul className="list-disc pl-6 ">
            <li>Personal Information: Name, email address, phone number, company details, and other identifiable information provided during registration.</li>
            <li>Account Information: Subscription details, payment information, and account preferences.</li>
            <li>Usage Data: Log files, cookies, IP addresses, browser type, device information, and interactions with our platform.</li>
            <li>Communication Data: Messages sent via integrated messaging platforms and customer support interactions.</li>
            <li>Third-Party Data: Information from linked accounts (e.g., payment gateways, messaging platforms).</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 ">
            <li>Provide, maintain, and improve our CRM services.</li>
            <li>Process transactions and manage subscriptions.</li>
            <li>Enhance security and prevent fraud.</li>
            <li>Offer customer support and respond to inquiries.</li>
            <li>Analyze usage trends to optimize user experience.</li>
            <li>Send notifications, updates, and promotional content (with opt-out options).</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">4. Data Sharing and Disclosure</h2>
          <p className="">We do not sell your personal data. However, we may share information with service providers, legal authorities, or in case of business transfers.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">5. Data Security</h2>
          <p className="">We implement industry-standard security measures, but users are responsible for maintaining account confidentiality.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">6. Data Retention</h2>
          <p className="">We retain your information as long as necessary. Users can request data deletion by contacting support.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">7. Your Rights</h2>
          <p className="">Depending on your location, you may have the right to access, update, delete your data, or withdraw consent for marketing.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">8. Cookies and Tracking Technologies</h2>
          <p className="">We use cookies to enhance user experience. You can manage preferences through browser settings.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">9. Third-Party Links</h2>
          <p className="">Our CRM may contain links to third-party services. We are not responsible for their privacy practices.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">10. Changes to This Privacy Policy</h2>
          <p className="">We may update this policy periodically. Continued use after updates constitutes acceptance.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">11. Contact Us</h2>
          <p className="">
            For questions, contact us at <Link href="mailto:support@nativetalk.io" className="text-blue-600">support@nativetalk.io</Link>.
          </p>
        </section>

        <div className="text-center mt-8">
          <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}