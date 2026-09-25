import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { getSettings } from "@/lib/settings";

// Menu and settings change from the admin panel, so always render fresh.
export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <Navbar restaurantName={settings.restaurantName} />
      {!settings.isOpen && (
        <div className="bg-red-600 px-4 py-2 text-center text-sm font-medium text-white">
          We&apos;re closed right now and not taking orders. Opening hours: {settings.openingHours}
        </div>
      )}
      <main className="min-h-[60vh]">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
