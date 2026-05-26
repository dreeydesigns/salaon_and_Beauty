import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-[#FAF9F6]">
      
      {/* =========================================
          PRIORITY 1: MOBILE & TABLET LAYOUT
          Active from Smartwatches up to Tablets (< 1024px)
          Completely ignores the large screen split.
          ========================================= */}
      <div className="block lg:hidden w-full min-h-screen">
        {children}
      </div>

      {/* =========================================
          PRIORITY 2: LARGE SCREEN / WEBSITE LAYOUT
          Active only on Laptops, TVs, and Billboards (>= 1024px)
          ========================================= */}
      <div className="hidden lg:grid lg:grid-cols-12 w-full min-h-screen">
        
        {/* The Black Editorial Sidebar (5 Columns) */}
        <div className="col-span-5 bg-black text-[#FAF9F6] p-16 flex flex-col justify-between items-start selection:bg-white selection:text-black">
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

        {/* The Form Interaction Hub (7 Columns) */}
        <div className="col-span-7 flex items-center justify-center p-12 xl:p-20">
          <div className="w-full max-w-[500px] animate-fade-in">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}