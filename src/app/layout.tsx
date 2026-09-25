import type { Metadata, Viewport } from "next";
import { DM_Sans, Poppins } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: { default: "Golden Spoon", template: "%s · Golden Spoon" },
  description: "Golden Spoon: taste the luxury. Browse the menu and order on WhatsApp.",
};

export const viewport: Viewport = { themeColor: "#0a0a0a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
