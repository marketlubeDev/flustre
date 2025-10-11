"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PrivacyPage() {
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600" suppressHydrationWarning>
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            1. Information We Collect
          </h2>
          <p className="text-gray-700 mb-6">
            We collect information you provide directly to us, such as when you
            create an account, make a purchase, or contact us for support. This
            may include your name, email address, phone number, and payment
            information.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-6">
            We use the information we collect to provide, maintain, and improve
            our services, process transactions, send you technical notices and
            support messages, and communicate with you about products, services,
            and events.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. Information Sharing
          </h2>
          <p className="text-gray-700 mb-6">
            We do not sell, trade, or otherwise transfer your personal
            information to third parties without your consent, except as
            described in this privacy policy or as required by law.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. Data Security
          </h2>
          <p className="text-gray-700 mb-6">
            We implement appropriate security measures to protect your personal
            information against unauthorized access, alteration, disclosure, or
            destruction. However, no method of transmission over the internet is
            100% secure.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. Cookies and Tracking
          </h2>
          <p className="text-gray-700 mb-6">
            We use cookies and similar tracking technologies to enhance your
            experience on our website, analyze usage patterns, and personalize
            content and advertisements.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            6. Your Rights
          </h2>
          <p className="text-gray-700 mb-6">
            You have the right to access, update, or delete your personal
            information. You may also opt out of certain communications from us.
            Contact us to exercise these rights.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            7. Changes to This Policy
          </h2>
          <p className="text-gray-700 mb-6">
            We may update this privacy policy from time to time. We will notify
            you of any changes by posting the new policy on this page and
            updating the &quot;Last updated&quot; date.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            8. Contact Us
          </h2>
          <p className="text-gray-700 mb-6">
            If you have any questions about this privacy policy, please contact
            us at privacy@souqalmart.com or through our customer support
            channels.
          </p>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-12">
          <Link
            href="/login"
            className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary)] font-medium"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
