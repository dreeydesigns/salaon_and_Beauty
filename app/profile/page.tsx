import { Suspense } from "react";

import { AppShell } from "@/components/app-shell";
import { AccountProfile } from "@/components/account-profile";
import { ClientRatingFlow } from "@/components/service-session";

export default function ProfilePage() {
  return (
    <AppShell currentNav="profile" roleMode="salons" requireSession>
      <ClientRatingFlow />
      <Suspense fallback={<div className="loader-bloom mx-auto mt-16 h-14 w-14" />}>
        <AccountProfile />
      </Suspense>
    </AppShell>
  );
}
