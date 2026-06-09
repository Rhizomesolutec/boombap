import type { Metadata } from "next";
import TermsContent from "./TermsContent";

export const metadata: Metadata = {
  title: "Terms and Conditions | BOOMBAP",
  description: "Read the Terms and Conditions of BOOMBAP regarding rules, regulations, and usage restrictions.",
};

export default function TermsPage() {
  return <TermsContent />;
}
