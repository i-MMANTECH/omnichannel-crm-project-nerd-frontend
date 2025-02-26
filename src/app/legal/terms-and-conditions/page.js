export default function Terms() {
  return (
    <div className="min-h-screen body-theme py-10 px-4 sm:px-8 md:px-16 lg:px-32">
      <div className="max-w-4xl mx-auto shadow-lg rounded-lg p-6 md:p-10">
        <h1 className="text-3xl font-bold  mb-6">Terms & Conditions</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">1. Introduction</h2>
          <p className="">
            Welcome to <span className="font-semibold">Native Talk CRM</span> ("Platform", "Service"), operated by 
            <span className="font-semibold"> Tech4mation Limited</span> ("Company", "we", "our", "us"). These Terms 
            of Service ("Terms") govern your use of our Customer Relationship Management (CRM) software. 
            By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy.
            If you do not agree, you may not use the Service.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">2. User Roles & Access</h2>
          <p className="">The Platform is designed for multiple user roles:</p>
          <ul className="list-disc list-inside  mt-2">
            <li><span className="font-medium">Admin:</span> Has full access, including managing users and billing.</li>
            <li><span className="font-medium">Agent:</span> Uses the Platform to interact with customers and manage CRM functionalities.</li>
            <li><span className="font-medium">Customer:</span> Uses the Platform to receive services and communicate with Agents.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">3. Subscription & Payment</h2>
          <p className="">
            The Service operates on a subscription-based model. By subscribing, you agree to provide accurate billing 
            information. Payments are processed via a third-party payment gateway. We reserve the right to modify 
            pricing and plans at any time with prior notice.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">4. Refund Policy</h2>
          <p className="">
            We have a no-refund policy. However, we offer customer support to assist with technical issues. 
            If you experience issues, contact <a href="mailto:support@nativetalk.io" className="text-blue-600 hover:underline">support@nativetalk.io</a>.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">5. Acceptable Use</h2>
          <p className="">Users agree not to:</p>
          <ul className="list-disc list-inside  mt-2">
            <li>Use the Service for fraudulent, illegal, or abusive activities.</li>
            <li>Share unauthorized access credentials.</li>
            <li>Transmit harmful content, including spam or malware.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">6. Data Privacy & Security</h2>
          <p className="">
            Your data privacy is important to us. We collect and process data in accordance with our Privacy Policy.
            You consent to data collection practices necessary for Service operation.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">7. Third-Party Integrations</h2>
          <p className="">
            The Platform integrates with messaging applications and third-party tools. 
            We are not responsible for their content, policies, or reliability.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">8. Service Modifications & Termination</h2>
          <p className="">
            We reserve the right to modify or discontinue the Service without prior notice. 
            We are not liable for any impact resulting from such modifications.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">9. Limitation of Liability</h2>
          <p className="">
            We provide the Service "as is" and make no warranties regarding uninterrupted access. 
            We are not responsible for any indirect, incidental, or consequential damages resulting from Service use.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">10. Governing Law</h2>
          <p className="">
            These Terms are governed by the laws of Nigeria. Any disputes arising shall be settled in Nigerian courts.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">11. Contact Information</h2>
          <p className="">
            For any inquiries, please contact 
            <a href="mailto:support@nativetalk.io" className="text-blue-600 hover:underline"> support@nativetalk.io</a>.
          </p>
        </section>

        <div className="text-center mt-8">
          <a href="/" className="text-blue-600 hover:underline">Back to Home</a>
        </div>
      </div>
    </div>
  );
}
