"use client";

import { useState } from "react";
import Link from "next/link";

export default function TermsConditions() {
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    orders: false,
    returns: false,
    privacy: false,
    liability: false,
    contact: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="bg-[#F5F5F5] rounded-lg p-0">
      <div className="bg-white rounded-lg p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Terms & Conditions
        </h2>
        <p className="text-gray-600 mb-6">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        {/* General Terms */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("general")}
            className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              General Terms
            </h3>
            <span className="text-gray-500">
              {expandedSections.general ? "−" : "+"}
            </span>
          </button>
          {expandedSections.general && (
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-700 mb-4">
                By using our services, you agree to these terms and conditions. Please read them carefully.
              </p>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.
              </p>
              <p className="text-gray-700">
                Your continued use of our services constitutes acceptance of any changes to these terms.
              </p>
            </div>
          )}
        </div>

        {/* Orders and Payment */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("orders")}
            className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Orders & Payments
            </h3>
            <span className="text-gray-500">
              {expandedSections.orders ? "−" : "+"}
            </span>
          </button>
          {expandedSections.orders && (
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-700 mb-4">
                All orders are subject to availability and acceptance by us.
              </p>
              <p className="text-gray-700 mb-4">
                Payment must be made in full before order processing.
              </p>
              <p className="text-gray-700 mb-4">
                We reserve the right to cancel orders at our discretion.
              </p>
              <p className="text-gray-700">
                Prices are subject to change without notice.
              </p>
            </div>
          )}
        </div>

        {/* Returns and Refunds */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("returns")}
            className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Returns & Refunds
            </h3>
            <span className="text-gray-500">
              {expandedSections.returns ? "−" : "+"}
            </span>
          </button>
          {expandedSections.returns && (
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-700 mb-4">
                Items must be returned within 30 days of purchase.
              </p>
              <p className="text-gray-700 mb-4">
                Products must be in original condition with all tags attached.
              </p>
              <p className="text-gray-700 mb-4">
                Refunds will be processed within 7-10 business days.
              </p>
              <p className="text-gray-700">
                Some items may be non-returnable as per our policy.
              </p>
            </div>
          )}
        </div>

        {/* Privacy and Data Protection */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("privacy")}
            className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Privacy & Data Protection
            </h3>
            <span className="text-gray-500">
              {expandedSections.privacy ? "−" : "+"}
            </span>
          </button>
          {expandedSections.privacy && (
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-700 mb-4">
                We are committed to protecting your personal information and privacy.
              </p>
              <p className="text-gray-700 mb-4">
                Your data is collected and processed in accordance with applicable data protection laws.
              </p>
              <p className="text-gray-700">
                Please refer to our Privacy Policy for detailed information about how we handle your data.
              </p>
            </div>
          )}
        </div>

        {/* Limitation of Liability */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("liability")}
            className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Limitation of Liability
            </h3>
            <span className="text-gray-500">
              {expandedSections.liability ? "−" : "+"}
            </span>
          </button>
          {expandedSections.liability && (
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-700 mb-4">
                Our liability is limited to the maximum extent permitted by law.
              </p>
              <p className="text-gray-700 mb-4">
                We are not liable for any indirect, incidental, or consequential damages.
              </p>
              <p className="text-gray-700">
                Our total liability shall not exceed the amount paid for the product or service.
              </p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("contact")}
            className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Contact Information
            </h3>
            <span className="text-gray-500">
              {expandedSections.contact ? "−" : "+"}
            </span>
          </button>
          {expandedSections.contact && (
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-700 mb-4">
                For questions regarding these terms and conditions, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Email:</strong> legal@flustre.com
                </p>
                <p>
                  <strong>Phone:</strong> +91-1800-XXX-XXXX
                </p>
                <p>
                  <strong>Address:</strong> Flustre Legal Department,
                  [Address]
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              By using our services, you acknowledge that you have read and agree to these terms and conditions.
            </p>
            <Link
              href="/terms"
              className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 font-medium"
            >
              View Full Terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
