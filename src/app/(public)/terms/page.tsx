import type { Metadata } from "next";
import TermsContent from "./TermsContent";

export const metadata: Metadata = {
  title: "Terms and Conditions | BOOMBAP",
  description: "Read the Terms and Conditions of BOOMBAP (organized by Devil Inside Records) regarding rules, regulations, and usage restrictions.",
};

export default function TermsPage() {
  return <TermsContent />;
}
