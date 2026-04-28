import { AppShell } from "@/components/app-shell";
import { RoleProfileWorkspace } from "@/components/role-profile-workspace";

export default function ProfilePage() {
  return (
    <AppShell currentNav="profile" roleMode="salons" requireSession>
      <RoleProfileWorkspace />
    </AppShell>
  );
}
