import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { FEATURED, MENU, slugify } from "./menu-data";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before seeding.");

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { name: "Admin", email, passwordHash: await bcrypt.hash(password, 10) },
  });

  await prisma.setting.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });

  let count = 0;
  for (const [ci, category] of MENU.entries()) {
    const cat = await prisma.category.upsert({
      where: { slug: slugify(category.name) },
      update: { name: category.name, sortOrder: ci },
      create: { name: category.name, slug: slugify(category.name), sortOrder: ci },
    });
    for (const [ii, item] of category.items.entries()) {
      const data = {
        name: item.name,
        description: item.description ?? "",
        price: item.price,
        fullPrice: item.fullPrice ?? null,
        baseLabel: item.baseLabel ?? "Normal",
        isVeg: item.isVeg ?? false,
        isFeatured: item.isFeatured ?? FEATURED.has(item.name),
        sortOrder: ii,
        categoryId: cat.id,
      };
      await prisma.menuItem.upsert({ where: { slug: slugify(item.name) }, update: data, create: { ...data, slug: slugify(item.name) } });
      count++;
    }
  }

  console.log(`Seeded admin ${email}, ${MENU.length} categories and ${count} menu items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
