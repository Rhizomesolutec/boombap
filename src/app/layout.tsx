import type { Metadata } from "next";
import { Sarpanch, Montserrat } from "next/font/google";
import "./globals.css";

const sarpanch = Sarpanch({
  weight: ["400", "900"],
  variable: "--font-sarpanch",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-proxima-nova",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "BOOMBAP",
  description: "Experience the rhythm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sarpanch.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white relative font-proxima">
        {children}
      </body>
    </html>
  );
}
