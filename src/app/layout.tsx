import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import CursorGlow from "@/components/CursorGlow";
import MLBackgroundCanvas from "@/components/MLBackgroundCanvas";
import LayoutClient from "@/components/LayoutClient";
import { BackgroundViewProvider } from "@/contexts/BackgroundViewContext";
import { Analytics } from "@vercel/analytics/next";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-[#060d1a] ${fraunces.variable}`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HJ4K5TPHDE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HJ4K5TPHDE');
          `}
        </Script>
        <BackgroundViewProvider>
          <div className="app-root bg-[#060d1a]">
            <CursorGlow />
            <MLBackgroundCanvas />
            <div className="global-orbs pointer-events-none" aria-hidden="true">
              <span className="orb orb-primary" />
              <span className="orb orb-indigo" />
              <span className="orb orb-blue" />
            </div>
            <LayoutClient>{children}</LayoutClient>
          </div>
        </BackgroundViewProvider>
        <Analytics />
      </body>
    </html>
  );
}
