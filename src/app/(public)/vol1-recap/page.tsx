import type { Metadata } from "next";
import Vol1RecapExperience from "../../../components/vol1/Vol1RecapExperience";

export const metadata: Metadata = {
  title: "Vol.01 Recap | BOOMBAP",
  description:
    "A vertical-video recap wall for BOOMBAP Vol.01: reels, crowd moments, selectors, and raw room energy.",
};

export default function Vol1RecapPage() {
  return <Vol1RecapExperience />;
}
