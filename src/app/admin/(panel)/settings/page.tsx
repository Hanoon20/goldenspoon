import { PasswordForm, SettingsForm } from "@/components/admin/SettingsForm";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSettings();
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-display text-3xl font-bold">Settings</h1>
      <p className="card p-4 text-sm">
        Right now the shop is{" "}
        <span className={settings.openNow ? "font-semibold text-green-700" : "font-semibold text-red-700"}>{settings.openNow ? "open" : "closed"}</span>
        {settings.nextChange && <> ({settings.nextChange.charAt(0).toLowerCase() + settings.nextChange.slice(1)})</>}
        {!settings.isOpen && <> because &ldquo;Accepting orders&rdquo; is turned off</>}.
      </p>
      <SettingsForm settings={settings} />
      <PasswordForm />
    </div>
  );
}
