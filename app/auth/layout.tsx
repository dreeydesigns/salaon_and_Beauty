import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-[#FAF9F6]">
      {/* LOGIC:
        On mobile/tablet (screens smaller than 'lg' / 1024px), we render 
        the children directly in a full-width container. 
        The grid layout is completely bypassed.
      */}
      <div className="lg:hidden w-full min-h-screen">
        {children}
      </div>

      {/* LOGIC:
        On large screens ('lg' / 1024px and up), we apply the 12-column 
        editorial split layout.
      */}
      <div className="hidden lg:grid lg:grid-cols-12 w-full min-h-screen">
        {/* Editorial Sidebar */}
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

        {/* Interaction Hub */}
        <div className="col-span-7 flex items-center justify-center p-12 xl:p-20">
          <div className="w-full max-w-[500px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}