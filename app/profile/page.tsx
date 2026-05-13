import { AppShell } from "@/components/app-shell";
import { RoleProfileWorkspace } from "@/components/role-profile-workspace";
import { ClientRatingFlow } from "@/components/service-session";

export default function ProfilePage() {
  return (
    <AppShell currentNav="profile" roleMode="salons" requireSession>
      {/* Rating flow — floats above when a session has just completed */}
      <ClientRatingFlow />
      <RoleProfileWorkspace />
    </AppShell>
  );
}
