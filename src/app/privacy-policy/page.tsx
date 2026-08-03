import PrivacyPolicyClient from "./PrivacyPolicyClient";
import { getPageSeo, buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const seo = await getPageSeo("privacy-policy");
  return {
    ...buildMetadata(seo, {
      title: "Privacy Policy | Vyom Regency Pvt Ltd",
      description: "Privacy Policy of Vyom Regency Pvt Ltd - Understand how we handle your personal data and information.",
    }),
    keywords: seo?.focus_keyword || "privacy policy, Vyom Regency, data protection",
  };
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
