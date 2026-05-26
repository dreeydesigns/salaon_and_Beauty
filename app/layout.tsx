import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ThemeApplicator } from "@/components/theme-applicator";

/* Inline script injected into <head> — runs before any paint so there is no
   flash of wrong theme when the user has dark mode / large text / etc. saved. */
const NO_FLASH_SCRIPT = `
try {
  var s = JSON.parse(localStorage.getItem('ms_app_settings.v1') || '{}');
  var h = document.documentElement;
  if (s.colorScheme) h.setAttribute('data-color-scheme', s.colorScheme);
  if (s.reduceMotion) h.setAttribute('data-reduce-motion', 'true');
  if (s.highContrast)  h.setAttribute('data-high-contrast', 'true');
  var zoom = {small:'0.9', medium:'1', large:'1.15'};
  h.style.setProperty('--ms-zoom', zoom[s.textSize] || '1');
  var lang = JSON.parse(localStorage.getItem('ms_language_pref') || '{}');
  if (lang.code) { h.lang = lang.code; h.dir = lang.dir || 'ltr'; }
} catch(e) {}
`;

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
    <html 
      lang="en" 
      className="h-full antialiased" 
      data-scroll-behavior="smooth"
      // Providing the initial style here prevents the hydration mismatch
      style={{ "--ms-zoom": "1" } as React.CSSProperties} 
    >
      <head>
        {/* No-flash: apply saved theme/zoom/lang before first paint */}
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body className="min-h-full bg-[var(--ms-soft-bg)] font-sans text-[var(--ms-charcoal)]">
        <ThemeApplicator />
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
