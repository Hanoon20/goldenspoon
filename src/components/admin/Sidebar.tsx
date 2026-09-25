"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListOrdered, LogOut, Settings, Tags, UtensilsCrossed, ExternalLink } from "lucide-react";
import { logout } from "@/app/admin/(panel)/actions";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ListOrdered },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ adminName, newOrders }: { adminName: string; newOrders: number }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <aside className="flex shrink-0 flex-col bg-ink-900 text-ink-200 md:h-screen md:w-60 md:sticky md:top-0">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gold-500 text-white">🥄</span>
        <span className="font-display text-lg font-bold text-white">Admin</span>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible">
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
              isActive(n.href) ? "bg-gold-500 text-white" : "hover:bg-white/10",
            )}
          >
            <n.icon className="h-4 w-4" />
            {n.label}
            {n.href === "/admin/orders" && newOrders > 0 && (
              <span className="ml-auto rounded-full bg-red-500 px-2 text-xs font-bold text-white">{newOrders}</span>
            )}
          </Link>
        ))}
        <Link href="/" target="_blank" className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10">
          <ExternalLink className="h-4 w-4" /> View site
        </Link>
        <form action={logout} className="shrink-0 md:hidden">
          <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </form>
      </nav>
      <div className="hidden border-t border-white/10 p-4 md:block">
        <p className="truncate text-sm text-white">{adminName}</p>
        <form action={logout}>
          <button className="mt-2 flex items-center gap-2 text-sm hover:text-white">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
