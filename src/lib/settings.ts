import { cache } from "react";
import { db } from "./db";
import { shopStatus } from "./hours";

/** The settings row plus the live open/closed status (worked out fresh for each request). */
export const getSettings = cache(async () => {
  const row = await db.setting.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  return { ...row, ...shopStatus(row) };
});
