import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SAB6 SHOW",
  description: "the first listen belongs to the real ones. step into the world of sab6 befo6 anyone else. limited entries. one night that won’t happen twice.",
  openGraph: {
    title: "SAB6 SHOW",
    description: "the first listen belongs to the real ones. step into the world of sab6 befo6 anyone else. limited entries. one night that won’t happen twice.",
    images: [
      {
        url: "https://www.boombap.in/SAB6/SAB6 Show.PNG",
        width: 1200,
        height: 630,
        alt: "SAB6 Show Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SAB6 SHOW",
    description: "the first listen belongs to the real ones. step into the world of sab6 befo6 anyone else. limited entries. one night that won’t happen twice.",
    images: ["https://www.boombap.in/SAB6/SAB6 Show.PNG"],
  },
};

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
