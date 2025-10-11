"use client";

import React from "react";

export default function HelpSupport() {
  const supportTopics = [
    {
      title: "Order Issues",
      description: "Track orders, modify orders, report issues",
      icon: "📦"
    },
    {
      title: "Account & Payment",
      description: "Manage account, payment methods, billing",
      icon: "👤"
    },
    {
      title: "Product Information",
      description: "Product details, specifications, availability",
      icon: "ℹ️"
    },
    {
      title: "Shipping & Delivery",
      description: "Delivery options, tracking, shipping rates",
      icon: "🚚"
    }
  ];

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Help & Support</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {supportTopics.map((topic, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-[var(--color-primary)] transition-colors cursor-pointer">
            <div className="flex items-start space-x-3">
              <span className="text-xl sm:text-2xl">{topic.icon}</span>
              <div>
                <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{topic.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{topic.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 sm:pt-6">
        <h3 className="font-medium text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Contact Us</h3>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-[var(--color-primary)]">📧</span>
            <span className="text-gray-700 text-sm sm:text-base">support@flustre.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-[var(--color-primary)]">📞</span>
            <span className="text-gray-700 text-sm sm:text-base">+91 1800-123-4567</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-[var(--color-primary)]">💬</span>
            <span className="text-gray-700 text-sm sm:text-base">Live Chat (Available 24/7)</span>
          </div>
        </div>
      </div>
    </div>
  );
} 