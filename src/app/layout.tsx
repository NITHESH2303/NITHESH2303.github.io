import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";
import CursorGlow from "@/components/CursorGlow";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Nithesh Kanna | Portfolio",
  description:
    "Portfolio of Nithesh Kanna, software developer focused on backend systems, enterprise integrations, and applied AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-[#060d1a] ${fraunces.variable}`}>
        <div className="app-root bg-[#060d1a]">
          <CursorGlow />
          <div className="global-orbs pointer-events-none" aria-hidden="true">
            <span className="orb orb-teal" />
            <span className="orb orb-indigo" />
            <span className="orb orb-blue" />
          </div>
          <div className="app-content">{children}</div>
        </div>
      </body>
    </html>
  );
}
