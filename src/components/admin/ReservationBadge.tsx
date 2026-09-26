import type { ReservationStatus } from "@prisma/client";
import { RESERVATION_STATUS_COLOR, RESERVATION_STATUS_LABEL } from "@/lib/booking";
import { cn } from "@/lib/utils";

export function ReservationBadge({ status }: { status: ReservationStatus }) {
  return (
    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold", RESERVATION_STATUS_COLOR[status])}>
      {RESERVATION_STATUS_LABEL[status]}
    </span>
  );
}
