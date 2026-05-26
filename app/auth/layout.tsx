import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-[#FAF9F6]">
      {/* 
        PRINCIPLE 1: MOBILE & TABLET (screens below 1024px)
        - This is the default view for all devices smaller than 'lg' breakpoint
        - Includes smart watches, phones, and tablets in portrait/landscape
        - Renders children directly in full-width container
        - Large screen layout is completely hidden and not rendered
      */}
      <div className="lg:hidden w-full min-h-screen">
        {children}
      </div>

      {/* 
        PRINCIPLE 2: DESKTOP & LARGE SCREENS (1024px and above)
        - Activates only when viewport width >= 1024px
        - Includes laptops, desktops, TVs, and billboards
        - Uses 12-column editorial split layout (5:7 ratio)
        - Mobile layout is completely hidden and not rendered
        - Responsive padding scales from p-12 to xl:p-20
      */}
      <div className="hidden lg:grid lg:grid-cols-12 w-full min-h-screen">
        {/* Editorial Sidebar - 5 columns on large screens */}
        <div className="col-span-5 bg-black text-[#FAF9F6] p-8 md:p-12 lg:p-16 flex flex-col justify-between items-start selection:bg-white selection:text-black">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-mono">
              The Collective
            </span>
          </div>
          <div className="max-w-sm">
            <h1 className="text-3xl md:text-4xl font-light tracking-tight leading-[1.15] mb-6 font-serif">
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

        {/* Interaction Hub - 7 columns on large screens */}
        <div className="col-span-7 flex items-center justify-center p-8 md:p-12 xl:p-20">
          <div className="w-full max-w-[500px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}