export function formatPrice(rupees: number) {
  return `Rs. ${rupees.toLocaleString("en-LK")}`;
}

export function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDateTime(d: Date) {
  return d.toLocaleString("en-LK", {
    timeZone: "Asia/Colombo",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Keeps digits only, so "+94 77 123-4567" becomes "94771234567" for wa.me links. */
export function waDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

/** Normalises a phone to international digits. Local Sri Lankan numbers ("0771234567") get the 94 country code. */
export function normalizePhone(phone: string) {
  const d = waDigits(phone);
  if (d.length === 10 && d.startsWith("0")) return `94${d.slice(1)}`;
  return d;
}
