import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { IntroSplash } from "@/components/shop/IntroSplash";
import { INTRO_GUARD_SCRIPT } from "@/lib/intro";
import { getSettings } from "@/lib/settings";

// Menu and settings change from the admin panel, so always render fresh.
export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: INTRO_GUARD_SCRIPT }} />
      <noscript>
        <style>{"#intro{display:none}"}</style>
      </noscript>
      <IntroSplash />
      <Navbar
        restaurantName={settings.restaurantName}
        whatsappNumber={settings.whatsappNumber}
        phone={settings.phone}
        hoursText={settings.hoursText}
        openNow={settings.openNow}
        nextChange={settings.nextChange}
      />
      {!settings.openNow && (
        <div className="bg-red-600 px-4 py-2 text-center text-sm font-medium text-white">
          We&apos;re closed right now and not taking orders. {settings.nextChange ? `${settings.nextChange}.` : `Opening hours: ${settings.hoursText}`}
        </div>
      )}
      <main className="min-h-[60vh]">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
