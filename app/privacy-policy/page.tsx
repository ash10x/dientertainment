import type { Metadata } from "next";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — diEntertainment",
  description: "Learn how diEntertainment collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <main className="max-w-3xl mx-auto px-6 lg:px-12 py-24">
        <h1 className="font-display text-5xl tracking-widest mb-4">
          <span className="text-[#E50019]">Privacy</span>{" "}
          <span className="text-[#F5F5F5]">Policy</span>
        </h1>
        <p className="text-[#F5F5F5]/35 text-sm mb-16">Last updated: May 2025</p>

        <div className="space-y-12 text-[#F5F5F5]/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-[#F5F5F5] text-base font-semibold tracking-widest uppercase mb-4">
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us, such as when you submit a contact
              form, request a quote, or otherwise communicate with us. This may include your name,
              email address, phone number, company name, and any other information you choose to
              provide.
            </p>
            <p className="mt-4">
              We also automatically collect certain information when you visit our website, including
              your IP address, browser type, operating system, referring URLs, and pages viewed. We
              use cookies and similar tracking technologies to collect this information.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F5] text-base font-semibold tracking-widest uppercase mb-4">
              2. How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-[#F5F5F5]/55">
              <li>Respond to your inquiries and fulfill your requests</li>
              <li>Send you information about our services</li>
              <li>Improve and optimize our website and services</li>
              <li>Comply with legal obligations</li>
              <li>Protect against fraudulent or unlawful activity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[#F5F5F5] text-base font-semibold tracking-widest uppercase mb-4">
              3. Sharing of Information
            </h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties
              without your consent, except as described in this policy. We may share your information
              with trusted service providers who assist us in operating our website and conducting our
              business, provided they agree to keep your information confidential.
            </p>
            <p className="mt-4">
              We may also disclose your information when required by law, to enforce our policies, or
              to protect the rights, property, or safety of diEntertainment, our clients, or others.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F5] text-base font-semibold tracking-widest uppercase mb-4">
              4. Cookies
            </h2>
            <p>
              Our website uses cookies to enhance your browsing experience. Cookies are small files
              placed on your device that help us analyze web traffic and customize content. You can
              choose to disable cookies through your browser settings, though this may affect certain
              features of our website.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F5] text-base font-semibold tracking-widest uppercase mb-4">
              5. Data Security
            </h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. However,
              no method of transmission over the internet or electronic storage is 100% secure, and we
              cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F5] text-base font-semibold tracking-widest uppercase mb-4">
              6. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete the personal information we hold about
              you. To exercise these rights or if you have any questions about this privacy policy,
              please contact us at{" "}
              <a
                href="mailto:privacy@dientertainment.com"
                className="text-[#E50019] hover:text-[#E50019]/80 transition-colors"
              >
                privacy@dientertainment.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F5] text-base font-semibold tracking-widest uppercase mb-4">
              7. Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes
              by posting the new policy on this page with an updated effective date. Your continued
              use of our website following any changes constitutes your acceptance of the revised
              policy.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
