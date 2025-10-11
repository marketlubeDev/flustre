"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function TermsPage() {
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
            Terms & Conditions
          </h1>
          <p className="text-gray-600" suppressHydrationWarning>
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 mb-6">
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. Use License
          </h2>
          <p className="text-gray-700 mb-6">
            Permission is granted to temporarily download one copy of the materials on Souqalmart's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. Disclaimer
          </h2>
          <p className="text-gray-700 mb-6">
            The materials on Souqalmart's website are provided on an 'as is' basis. Souqalmart makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. Limitations
          </h2>
          <p className="text-gray-700 mb-6">
            In no event shall Souqalmart or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Souqalmart's website.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. Revisions and Errata
          </h2>
          <p className="text-gray-700 mb-6">
            The materials appearing on Souqalmart's website could include technical, typographical, or photographic errors. Souqalmart does not warrant that any of the materials on its website are accurate, complete or current. Souqalmart may make changes to the materials contained on its website at any time without notice.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            6. Links
          </h2>
          <p className="text-gray-700 mb-6">
            Souqalmart has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Souqalmart of the site. Use of any such linked website is at the user's own risk.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            7. Site Terms of Use Modifications
          </h2>
          <p className="text-gray-700 mb-6">
            Souqalmart may revise these terms of use for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
          </p>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-12">
          <Link
            href="/login"
            className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary)] font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
