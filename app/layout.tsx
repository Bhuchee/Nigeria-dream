import type { Metadata } from "next";
import { Fraunces as FontFraunces, DM_Sans as FontDMSans } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const fraunces = FontFraunces({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-fraunces",
  display: "swap",
  preload: true,
});

const dmSans = FontDMSans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "The Nigeria of My Dream",
  description: "A Gen Z NDC community project. Share your dream for Nigeria.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="h-full">
        <div className="min-h-screen flex flex-col">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}