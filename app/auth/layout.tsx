import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* This layout is now completely free of sidebars. 
       - min-h-screen ensures it fills the height.
       - flex centers the content.
       - max-w-xl (on large screens) allows the form to expand slightly 
         more than the mobile-only setting.
    */
    <div className="w-full min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] lg:max-w-[450px]">
        {children}
      </div>
    </div>
  );
}