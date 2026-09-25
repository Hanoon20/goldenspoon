import { PasswordForm, SettingsForm } from "@/components/admin/SettingsForm";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSettings();
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-display text-3xl font-bold">Settings</h1>
      <SettingsForm settings={settings} />
      <PasswordForm />
    </div>
  );
}
