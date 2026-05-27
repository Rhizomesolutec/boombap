import type { Metadata } from "next";
import RefundPolicyContent from "./RefundPolicyContent";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | BOOMBAP",
  description: "Read the Cancellation and Refund Policy of BOOMBAP (organized by Devil Inside Records) regarding tickets and event cancellations.",
};

export default function RefundPolicyPage() {
  return <RefundPolicyContent />;
}
