import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mobile Salon",
    template: "%s | Mobile Salon",
  },
  description:
    "Mobile-first Nairobi beauty marketplace for clients, salons, and independent professionals.",
  applicationName: "Mobile Salon",
  keywords: [
    "Nairobi beauty",
    "salon booking",
    "mobile salon",
    "Kenyan beauty professionals",
    "beauty marketplace",
  ],
  category: "beauty",
  appleWebApp: {
    capable: true,
    title: "Mobile Salon",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#3A183A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full bg-[var(--ms-soft-bg)] font-sans text-[var(--ms-charcoal)]">
        {children}
      </body>
    </html>
  );
}
