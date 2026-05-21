import type { Metadata } from "next";
import { Sarpanch, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import CustomCursor from "../components/layout/CustomCursor";
import PageLoader from "../components/layout/PageLoader";
import Footer from "../components/layout/Footer";

const sarpanch = Sarpanch({
  weight: ["400", "900"],
  variable: "--font-sarpanch",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-proxima-nova", // Using Montserrat as a replacement for Proxima Nova
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
        <div className="fixed inset-0 -z-30 bg-secondary" />
        <div className="fixed inset-0 -z-10 pointer-events-none">
        </div>
        <PageLoader />
        <Header />
        <main className="grow">{children}</main>
        <CustomCursor />
        <Footer/>
      </body>
    </html>
  );
}
