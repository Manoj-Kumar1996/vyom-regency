"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicyClient() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <section className="relative pt-24 pb-10 bg-gradient-to-r from-green-900 to-green-800 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.2)"></circle>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pattern)"></rect>
            </svg>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Privacy <span className="text-amber-400">Policy</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Vyom Regency Pvt Ltd
            </p>
            <div className="w-24 h-1 bg-amber-400 mx-auto mt-6 rounded-full"></div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p>
                We are aware that all sensitive personal data needs to be carefully handled and protected. However, Vyom Regency Private Limited is designed to make your profile and property-related information available to users for their needs, as provided by you, without any protection.
              </p>

              <p>
                We treat all the data provided by you on this platform as non-critical and available to share. Vyom Regency Private Limited has complete rights to use or share this information for a fee or free, depending on the company&apos;s strategy from time to time. As a part of this Privacy Policy, we intend to keep you aware and encourage you to stay up-to-date with our policy for using our services. This Privacy Policy will also inform you of ways you can manage the information you share with us. If you do not agree with this Policy or our Terms of Use, please do not continue to use or access our platform or any part thereof.
              </p>

              <p>
                This Privacy Policy is subject to the terms of use and constitutes a valid and legally binding agreement between you as a user and the Vyom Regency Private Limited platform and any services thereon are being provided to you as a service on a revocable, limited, non-exclusive, and non-transferable license.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">Scope</h2>
              <p>
                This Privacy Policy is valid for our services offered through the Vyom Regency Private Limited platform including website. We handle user data securely and adhere to industry-standard security norms. If you wish to continue using the Vyom Regency Private Limited platform, you agree to provide us with the required information as detailed here and also agree to the &ldquo;Terms and Conditions&rdquo; and &ldquo;Privacy Policy&rdquo;.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">The Information We Collect</h2>
              <p>
                To use our services on the Vyom Regency Private Limited platform, the user must first complete the registration form. As part of the registration process, a user is required to supply their personal information as mentioned below:
              </p>
              <p>You will know the information we are collecting from you. To use the Application, we collect:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your full name.</li>
                <li>Your mobile number</li>
                <li>Your email address</li>
                <li>Your complete address.</li>
                <li>Profile photo (Optional)</li>
                <li>Your Verification Document (may be required by our Admin to approve your registration request).</li>
              </ul>

              <p className="font-semibold">Additional Information</p>
              <p>
                We may collect information about you, with your permission, in the following general categories:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Your Post Details:</strong> Your posted information will be available to all users searching for similar needs.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">Use of Information</h2>
              <p>
                Information collected by us through the Vyom Regency Private Limited platform may be used for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Use this in the backend logic to be able to provide our services to you.</li>
                <li>Our internal record keeping.</li>
                <li>Offer new, improved, and personalized services to our users.</li>
                <li>Send important communication from us and from our recommended service/product providers.</li>
                <li>To resolve disputes that may arise with the use of our services and to help promote a safe service to all our users.</li>
                <li>All information on this platform can be utilized for financial and non-financial reasons as per current or future company strategies. We may also use it to improve the user experience by introducing new services and products from time to time.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">User Credentials</h2>
              <p>
                You are responsible for maintaining the confidentiality of your credentials and are completely responsible for all the activities that occur under your account. If you suspect any unauthorized usage/access of your account, you agree to immediately reset/change your credentials and notify us (if needed). Vyom Regency Private Limited will not be liable for any consequences caused by any unintended security gaps.
              </p>
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <p className="text-gray-500 text-sm">
                If you have any questions about this Privacy Policy, please{" "}
                <Link href="/contact" className="text-green-600 hover:text-green-700 underline">
                  contact us
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
