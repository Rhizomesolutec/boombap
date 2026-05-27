import type { Metadata } from "next";
import PrivacyContent from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | BOOMBAP",
  description: "Read the privacy policy of BOOMBAP (organized by Devil Inside Records) regarding how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
