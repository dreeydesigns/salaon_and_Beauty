"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { CTAButton } from "@/components/marketplace-ui";
import {
  createPreviewClientSession,
  createPreviewProfessionalSession,
  createPreviewSalonSession,
  readAppSession,
  writeAppSession,
  type AppUserRole,
} from "@/lib/client-session";

export function SessionLaunchButton({
  role,
  destination,
  children,
  className,
  variant = "primary",
}: {
  role: AppUserRole;
  destination: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark";
}) {
  const router = useRouter();

  function handleLaunch() {
    const existing = readAppSession();

    if (existing?.role === role) {
      writeAppSession(existing);
    } else if (role === "client") {
      writeAppSession(createPreviewClientSession());
    } else if (role === "salon") {
      writeAppSession(createPreviewSalonSession());
    } else {
      writeAppSession(createPreviewProfessionalSession());
    }

    router.push(destination);
  }

  return (
    <CTAButton className={className} onClick={handleLaunch} type="button" variant={variant}>
      {children}
    </CTAButton>
  );
}
