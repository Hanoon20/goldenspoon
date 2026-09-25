"use client";

import { useEffect, useRef } from "react";
import { useFormAction } from "@/lib/use-form-action";
import type { Setting } from "@prisma/client";
import { changePassword, saveSettings } from "@/app/admin/(panel)/actions";
import { FormMessage } from "./FormMessage";

export function SettingsForm({ settings }: { settings: Setting }) {
  const [state, onSubmit, pending] = useFormAction(saveSettings, null);
  const field = (name: keyof Setting, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} className="input" defaultValue={String(settings[name] ?? "")} {...props} />
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <h2 className="font-semibold">Restaurant details</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {field("restaurantName", "Restaurant name", { required: true })}
        {field("tagline", "Tagline")}
        {field("whatsappNumber", "WhatsApp number (orders go here)", { required: true, placeholder: "94771234567" })}
        {field("phone", "Phone")}
        {field("email", "Email", { type: "email" })}
        {field("openingHours", "Opening hours")}
      </div>
      <div>
        <label className="label" htmlFor="address">Address</label>
        <textarea id="address" name="address" rows={2} className="input" defaultValue={settings.address} />
      </div>
      {field("mapUrl", "Google Maps link", { type: "url", placeholder: "https://maps.app.goo.gl/…" })}
      <div className="grid gap-4 sm:grid-cols-2">
        {field("deliveryFee", "Delivery fee (Rs.)", { type: "number", min: 0 })}
        {field("minOrder", "Minimum order (Rs.)", { type: "number", min: 0 })}
      </div>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="isOpen" defaultChecked={settings.isOpen} className="h-4 w-4 accent-gold-500" />
        Accepting orders now (untick to close the shop temporarily)
      </label>
      <FormMessage state={state} />
      <button disabled={pending} className="btn-primary">{pending ? "Saving…" : "Save settings"}</button>
    </form>
  );
}

export function PasswordForm() {
  const [state, onSubmit, pending] = useFormAction(changePassword, null);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);
  return (
    <form ref={formRef} onSubmit={onSubmit} className="card space-y-4 p-6">
      <h2 className="font-semibold">Change password</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="current">Current password</label>
          <input id="current" name="current" type="password" required autoComplete="current-password" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="next">New password</label>
          <input id="next" name="next" type="password" required minLength={8} autoComplete="new-password" className="input" />
        </div>
      </div>
      <FormMessage state={state} />
      <button disabled={pending} className="btn-dark">{pending ? "Updating…" : "Update password"}</button>
    </form>
  );
}
