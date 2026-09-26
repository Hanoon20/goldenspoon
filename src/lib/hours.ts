import { formatTime, isValidTime, nowTimeInColombo } from "./booking";

type HoursSettings = {
  isOpen: boolean;
  autoHours: boolean;
  openTime: string;
  closeTime: string;
  openingHours: string;
};

export type ShopStatus = {
  /** True when the shop is taking orders right now. */
  openNow: boolean;
  /** Opening hours as shown to customers. */
  hoursText: string;
  /** "Closes at 10:00 PM" / "Opens at 10:00 AM", or "" when there is nothing useful to say. */
  nextChange: string;
};

/** Whether "HH:MM" `t` falls in [open, close). A close time at or before the open time runs past midnight. */
export function isWithinHours(t: string, open: string, close: string) {
  if (open === close) return true; // open all day
  return open < close ? t >= open && t < close : t >= open || t < close;
}

/** Works out whether the shop is open now: the manual switch must be on, and with automatic hours, Sri Lanka time must be inside the opening hours. */
export function shopStatus(s: HoursSettings, now = new Date()): ShopStatus {
  const auto = s.autoHours && isValidTime(s.openTime) && isValidTime(s.closeTime);
  const hoursText = auto
    ? s.openTime === s.closeTime
      ? "Open 24 hours, every day"
      : `${formatTime(s.openTime)} - ${formatTime(s.closeTime)}, every day`
    : s.openingHours;

  if (!s.isOpen) return { openNow: false, hoursText, nextChange: "" };
  if (!auto || s.openTime === s.closeTime) return { openNow: true, hoursText, nextChange: "" };

  const openNow = isWithinHours(nowTimeInColombo(now), s.openTime, s.closeTime);
  return {
    openNow,
    hoursText,
    nextChange: openNow ? `Closes at ${formatTime(s.closeTime)}` : `Opens at ${formatTime(s.openTime)}`,
  };
}
