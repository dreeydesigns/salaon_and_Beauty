import Link from "next/link";
import type { ReactNode } from "react";

import type { NavKey, RoleMode } from "@/lib/site-data";
import { ClientSessionGate } from "@/components/client-session-gate";
import { BottomMobileNav, SplitBrandHeader } from "@/components/marketplace-ui";

export function AppShell({
  children,
  currentNav,
  roleMode,
  requireSession = false,
  showBottomNav = true,
  showFooter = false,
}: {
  children: ReactNode;
  currentNav: NavKey;
  roleMode: RoleMode;
  requireSession?: boolean;
  showBottomNav?: boolean;
  showFooter?: boolean;
}) {
  return (
    <div className="feminine-shell min-h-screen">
      <SplitBrandHeader currentNav={currentNav} roleMode={roleMode} />
      <main className="mx-auto min-h-[calc(100vh-180px)] w-full max-w-7xl overflow-hidden px-4 pb-28 pt-6 lg:px-6 lg:pb-12">
        {requireSession ? <ClientSessionGate>{children}</ClientSessionGate> : children}
      </main>
      {showFooter ? (
        <footer className="border-t border-[var(--ms-border)] bg-white/90">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-[var(--ms-mauve)] lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div>
              <p className="font-semibold text-[var(--ms-navy)]">Mobile Salon</p>
              <p className="mt-1">Beauty in your fingertips. Clear, trusted booking across Nairobi.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/guide" className="hover:text-[var(--ms-navy)]">
                Guide
              </Link>
              <Link href="/help" className="hover:text-[var(--ms-navy)]">
                Help & policy
              </Link>
              <Link href="/explore" className="hover:text-[var(--ms-navy)]">
                Product Marketplace
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
