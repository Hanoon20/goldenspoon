import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type SeedItem = {
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  isFeatured?: boolean;
};

// Sample Sri Lankan menu so the site looks complete on first run.
// Replace it with the restaurant's real dishes, prices and photos from Admin → Menu.
const menu: Record<string, SeedItem[]> = {
  Kottu: [
    { name: "Chicken Kottu", description: "Chopped godamba roti stir-fried on the hot plate with chicken, egg, leeks and spicy curry gravy.", price: 1100, isVeg: false, isFeatured: true },
    { name: "Cheese Kottu", description: "Our creamy, cheesy take on the classic chicken kottu.", price: 1450, isVeg: false, isFeatured: true },
    { name: "Egg Kottu", description: "Godamba roti chopped with egg, vegetables and curry.", price: 850, isVeg: false },
    { name: "Vegetable Kottu", description: "Loaded with carrot, leeks and cabbage in a mild vegetable curry.", price: 750, isVeg: true },
  ],
  "Rice & Curry": [
    { name: "Chicken Rice & Curry", description: "Red or white rice with chicken curry, dhal, three vegetable curries, papadam and sambol.", price: 950, isVeg: false, isFeatured: true },
    { name: "Fish Rice & Curry", description: "Rice with ambul thiyal-style fish curry, dhal, vegetables, papadam and sambol.", price: 1000, isVeg: false },
    { name: "Vegetable Rice & Curry", description: "Rice with dhal, four seasonal vegetable curries, papadam and pol sambol.", price: 650, isVeg: true },
    { name: "Lamprais", description: "Dutch-Burgher classic: rice, frikkadel, curries and blachan baked in banana leaf.", price: 1650, isVeg: false, isFeatured: true },
  ],
  "Fried Rice & Noodles": [
    { name: "Mixed Fried Rice", description: "Wok-tossed rice with chicken, prawns, egg and vegetables, served with chilli paste.", price: 1500, isVeg: false, isFeatured: true },
    { name: "Chicken Fried Rice", description: "Classic fried rice with chicken and egg.", price: 1150, isVeg: false },
    { name: "Seafood Noodles", description: "Stir-fried noodles with prawns, cuttlefish and vegetables.", price: 1600, isVeg: false },
    { name: "Vegetable Noodles", description: "Stir-fried noodles with fresh vegetables and soy.", price: 800, isVeg: true },
  ],
  Devilled: [
    { name: "Devilled Chicken", description: "Crispy chicken tossed with capsicum, onion and sweet-spicy chilli sauce.", price: 1400, isVeg: false, isFeatured: true },
    { name: "Devilled Prawns", description: "Prawns tossed in a fiery devilled sauce.", price: 1900, isVeg: false },
    { name: "Hot Butter Cuttlefish", description: "Golden-fried cuttlefish with butter, garlic and green chilli.", price: 1800, isVeg: false },
  ],
  "Short Eats": [
    { name: "Fish Roll", description: "Crumbed pancake roll filled with spiced fish and potato (2 pcs).", price: 300, isVeg: false },
    { name: "Vegetable Roti", description: "Triangle roti stuffed with spicy potato and vegetables (2 pcs).", price: 250, isVeg: true },
    { name: "Chicken Patties", description: "Crispy half-moon pastries with curried chicken (2 pcs).", price: 320, isVeg: false },
  ],
  Desserts: [
    { name: "Watalappan", description: "Jaggery and coconut milk custard spiced with cardamom and nutmeg.", price: 450, isVeg: true, isFeatured: true },
    { name: "Curd & Treacle", description: "Buffalo curd with kithul treacle.", price: 500, isVeg: true },
    { name: "Fruit Salad with Ice Cream", description: "Fresh tropical fruits with a scoop of vanilla.", price: 550, isVeg: true },
  ],
  Beverages: [
    { name: "Faluda", description: "Rose syrup, basil seeds, jelly and ice cream in chilled milk.", price: 600, isVeg: true },
    { name: "Iced Milo", description: "Thick, chilled Milo shake.", price: 450, isVeg: true },
    { name: "Fresh Lime Juice", description: "Freshly squeezed, sweet or salted.", price: 350, isVeg: true },
    { name: "Plain Tea", description: "Hot Ceylon tea.", price: 120, isVeg: true },
  ],
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before seeding.");

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { name: "Admin", email, passwordHash: await bcrypt.hash(password, 10) },
  });

  await prisma.setting.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });

  const categoryNames = Object.keys(menu);
  for (const [ci, categoryName] of categoryNames.entries()) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(categoryName) },
      update: {},
      create: { name: categoryName, slug: slugify(categoryName), sortOrder: ci },
    });
    for (const [ii, item] of menu[categoryName].entries()) {
      await prisma.menuItem.upsert({
        where: { slug: slugify(item.name) },
        update: {},
        create: { ...item, slug: slugify(item.name), sortOrder: ii, categoryId: category.id },
      });
    }
  }

  console.log(`Seeded admin ${email}, ${categoryNames.length} categories and menu items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
