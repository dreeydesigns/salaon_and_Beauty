import Link from "next/link";
import type { ReactNode } from "react";

import type { NavKey, RoleMode } from "@/lib/site-data";
import { BottomMobileNav, SplitBrandHeader } from "@/components/marketplace-ui";

export function AppShell({
  children,
  currentNav,
  roleMode,
  showBottomNav = true,
  showFooter = false,
}: {
  children: ReactNode;
  currentNav: NavKey;
  roleMode: RoleMode;
  showBottomNav?: boolean;
  showFooter?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[var(--ms-soft-bg)]">
      <SplitBrandHeader currentNav={currentNav} roleMode={roleMode} />
      <main className="mx-auto min-h-[calc(100vh-180px)] max-w-7xl px-4 pb-28 pt-6 lg:px-6 lg:pb-12">
        {children}
      </main>
      {showFooter ? (
        <footer className="border-t border-[var(--ms-border)] bg-white/90">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-[var(--ms-mauve)] lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div>
              <p className="font-semibold text-[var(--ms-navy)]">Mobile Salon</p>
              <p className="mt-1">Beauty in your fingertips. Clear, trusted booking across Nairobi.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/help" className="hover:text-[var(--ms-navy)]">
                Help & policy
              </Link>
              <Link href="/salons" className="hover:text-[var(--ms-navy)]">
                Salons
              </Link>
              <Link href="/professionals" className="hover:text-[var(--ms-navy)]">
                Professionals
              </Link>
              <Link href="/book" className="hover:text-[var(--ms-navy)]">
                Book
              </Link>
            </div>
          </div>
        </footer>
      ) : null}
      {showBottomNav ? <BottomMobileNav currentNav={currentNav} /> : null}
    </div>
  );
}
