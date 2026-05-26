import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-12 bg-[#FAF9F6]">
      {/* Editorial Sidebar */}
      <div className="hidden md:flex md:col-span-5 bg-black text-[#FAF9F6] p-16 flex-col justify-between items-start selection:bg-white selection:text-black">
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

      {/* Main Interactive Form Area */}
      <div className="col-span-1 md:col-span-7 flex items-center justify-center p-8 sm:p-12 md:p-20">
        <div className="w-full max-w-[400px] py-8 animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}