import type { Metadata } from "next";
import { DM_Sans, Great_Vibes, Playfair_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--ms-soft-bg)] font-sans text-[var(--ms-charcoal)]">
        {children}
      </body>
    </html>
  );
}
