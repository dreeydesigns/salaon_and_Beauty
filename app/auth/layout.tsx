import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* MOBILE-FIRST ENGINE:
      By default on mobile, we use a basic block column layout with a clean off-white background.
      On desktop (md:), it transforms into a high-end 12-column side-by-side grid.
    */
    <div className="min-h-screen w-full block md:grid md:grid-cols-12 bg-[#FAF9F6]">
      
      {/* EDITORIAL SIDEBAR PANEL:
        Hidden completely on mobile ('hidden') to give the signup flow full structural breathing room.
        It renders as an authoritative 5-column brand statement only on desktop viewports ('md:flex').
      */}
      <div className="hidden md:flex md:col-span-5 bg-black text-[#FAF9F6] p-16 flex-col justify-between items-start selection:bg-white selection:text-black min-h-screen">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-mono">
            The Collective
          </span>
        </div>
        
        <div className="max-w-sm">
          <h1 className="text-4xl font-light tracking-tight leading-[1.15] mb-6 font-serif">
            Structure before embellishment.
          </h1>
          <p className="text-sm tracking-wide text-neutral-400 font-light leading-relaxed">
            Experience curated wellness and beauty treatments scheduled seamlessly around your life.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-wider text-neutral-500 font-light font-mono">
            © 2026 SALON & BEAUTY.
          </p>
        </div>
      </div>

      {/* FORM INTERACTION PANEL:
        On mobile, this spans the natural width of the device with safe padding.
        On desktop, it transitions gracefully into a centered 7-column layout space.
      */}
      <div className="w-full md:col-span-7 flex items-center justify-center p-4 sm:p-12 md:p-20 min-h-screen">
        <div className="w-full max-w-[440px] py-6 animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}