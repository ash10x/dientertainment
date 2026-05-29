import type { Metadata } from "next";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — diEntertainment",
  description: "Read the terms and conditions governing your use of diEntertainment's website and services.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <main className="max-w-3xl mx-auto px-6 lg:px-12 py-24">
        <h1 className="font-display text-5xl tracking-widest mb-4">
          <span className="text-[#E50019]">Terms of</span>{" "}
          <span className="text-[#F5F5F5]">Service</span>
        </h1>
        <p className="text-[#F5F5F5]/35 text-sm mb-16">Last updated: May 2025</p>

        <div className="space-y-12 text-[#F5F5F5]/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-[#F5F5F5] text-base font-semibold tracking-widest uppercase mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using the diEntertainment website and services, you accept and agree
              to be bound by these Terms of Service. If you do not agree to these terms, please do
              not use our website or services.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F5] text-base font-semibold tracking-widest uppercase mb-4">
              2. Services
            </h2>
            <p>
              diEntertainment provides digital marketing, news and media, photo production, video
              production, AI image generation, AI video creation, and script writing services. The
              specific terms of any service engagement will be governed by a separate service
              agreement between diEntertainment and the client.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F5] text-base font-semibold tracking-widest uppercase mb-4">
              3. Intellectual Property
            </h2>
            <p>
              All content on this website, including text, graphics, logos, images, and software, is
              the property of diEntertainment and is protected by applicable intellectual property
              laws. You may not reproduce, distribute, or create derivative works from any content on
              this website without our express written permission.
            </p>
            <p className="mt-4">
              Work product created for clients under a service agreement will be governed by the
              intellectual property provisions of that agreement.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F5] text-base font-semibold tracking-widest uppercase mb-4">
              4. User Conduct
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-[#F5F5F5]/55">
              <li>Use our website for any unlawful purpose</li>
              <li>Transmit any harmful, offensive, or disruptive content</li>
              <li>Attempt to gain unauthorized access to any part of our systems</li>
              <li>Interfere with or disrupt the integrity or performance of our website</li>
              <li>
                Collect or harvest any personally identifiable information from our website
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[#F5F5F5] text-base font-semibold tracking-widest uppercase mb-4">
              5. Disclaimer of Warranties
            </h2>
            <p>
              Our website and services are provided on an &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; basis without any warranties of any kind, either express or implied.
              We do not warrant that our website will be uninterrupted, error-free, or free of
              viruses or other harmful components.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F5] text-base font-semibold tracking-widest uppercase mb-4">
              6. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, diEntertainment shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising out of or
              related to your use of our website or services, even if we have been advised of the
              possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F5] text-base font-semibold tracking-widest uppercase mb-4">
              7. Third-Party Links
            </h2>
            <p>
              Our website may contain links to third-party websites. These links are provided for
              your convenience only. We have no control over the content of those websites and accept
              no responsibility for them or for any loss or damage that may arise from your use of
              them.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F5] text-base font-semibold tracking-widest uppercase mb-4">
              8. Governing Law
            </h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with applicable
              laws. Any disputes arising under these terms shall be subject to the exclusive
              jurisdiction of the appropriate courts.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F5] text-base font-semibold tracking-widest uppercase mb-4">
              9. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Changes will be
              effective immediately upon posting to the website. Your continued use of our website
              following any changes constitutes your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F5F5] text-base font-semibold tracking-widest uppercase mb-4">
              10. Contact
            </h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a
                href="mailto:legal@dientertainment.com"
                className="text-[#E50019] hover:text-[#E50019]/80 transition-colors"
              >
                legal@dientertainment.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
