import type { OrderStatus } from "@prisma/client";
import { STATUS_COLOR, STATUS_LABEL } from "@/lib/order-status";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_COLOR[status])}>
      {STATUS_LABEL[status]}
    </span>
  );
}
