-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "baseLabel" TEXT NOT NULL DEFAULT 'Normal',
ADD COLUMN     "fullPrice" INTEGER;

-- Remove the sample dishes from the original demo seed (past orders keep their copied names and prices).
DELETE FROM "MenuItem" WHERE "slug" IN ('cheese-kottu', 'vegetable-kottu', 'chicken-rice-curry', 'fish-rice-curry', 'vegetable-rice-curry', 'lamprais', 'devilled-chicken', 'devilled-prawns', 'hot-butter-cuttlefish', 'fish-roll', 'vegetable-roti', 'chicken-patties', 'watalappan', 'curd-treacle', 'iced-milo', 'fresh-lime-juice');

-- Golden Spoon's real menu, generated from prisma/menu-data.ts. Existing dishes with the same name are updated;
-- their photo and availability are kept.
INSERT INTO "Category" ("id", "name", "slug", "sortOrder") VALUES (gen_random_uuid()::text, 'Kottu', 'kottu', 0)
  ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "Category" ("id", "name", "slug", "sortOrder") VALUES (gen_random_uuid()::text, 'Rice', 'rice', 1)
  ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "Category" ("id", "name", "slug", "sortOrder") VALUES (gen_random_uuid()::text, 'Biriyani & Platters', 'biriyani-platters', 2)
  ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "Category" ("id", "name", "slug", "sortOrder") VALUES (gen_random_uuid()::text, 'Noodles', 'noodles', 3)
  ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "Category" ("id", "name", "slug", "sortOrder") VALUES (gen_random_uuid()::text, 'String Hoppers', 'string-hoppers', 4)
  ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "Category" ("id", "name", "slug", "sortOrder") VALUES (gen_random_uuid()::text, 'BBQ & Tandoori', 'bbq-tandoori', 5)
  ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "Category" ("id", "name", "slug", "sortOrder") VALUES (gen_random_uuid()::text, 'Curry & Gravy', 'curry-gravy', 6)
  ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "Category" ("id", "name", "slug", "sortOrder") VALUES (gen_random_uuid()::text, 'Parotta', 'parotta', 7)
  ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "Category" ("id", "name", "slug", "sortOrder") VALUES (gen_random_uuid()::text, 'Starters', 'starters', 8)
  ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "Category" ("id", "name", "slug", "sortOrder") VALUES (gen_random_uuid()::text, 'Side Dishes', 'side-dishes', 9)
  ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "Category" ("id", "name", "slug", "sortOrder") VALUES (gen_random_uuid()::text, 'Omelettes', 'omelettes', 10)
  ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "Category" ("id", "name", "slug", "sortOrder") VALUES (gen_random_uuid()::text, 'Bread & Bites', 'bread-bites', 11)
  ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "Category" ("id", "name", "slug", "sortOrder") VALUES (gen_random_uuid()::text, 'Desserts & Ice Cream', 'desserts-ice-cream', 12)
  ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "Category" ("id", "name", "slug", "sortOrder") VALUES (gen_random_uuid()::text, 'Fresh Juices', 'fresh-juices', 13)
  ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "Category" ("id", "name", "slug", "sortOrder") VALUES (gen_random_uuid()::text, 'Shakes & Lassi', 'shakes-lassi', 14)
  ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "Category" ("id", "name", "slug", "sortOrder") VALUES (gen_random_uuid()::text, 'Mojitos & Specials', 'mojitos-specials', 15)
  ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "sortOrder" = EXCLUDED."sortOrder";
INSERT INTO "Category" ("id", "name", "slug", "sortOrder") VALUES (gen_random_uuid()::text, 'Hot Drinks', 'hot-drinks', 16)
  ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "sortOrder" = EXCLUDED."sortOrder";

-- Kottu
INSERT INTO "MenuItem" ("id", "name", "slug", "description", "price", "fullPrice", "baseLabel", "isVeg", "isFeatured", "sortOrder", "categoryId", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Egg Kottu', 'egg-kottu', 'Chopped godamba roti stir-fried on the hot plate with vegetables, egg and spices.', 700, 1100, 'Normal', false, false, 0, (SELECT "id" FROM "Category" WHERE "slug" = 'kottu'), NOW()),
  (gen_random_uuid()::text, 'Chicken Kottu', 'chicken-kottu', 'Chopped godamba roti stir-fried on the hot plate with vegetables, egg and spices.', 1000, 1300, 'Normal', false, true, 1, (SELECT "id" FROM "Category" WHERE "slug" = 'kottu'), NOW()),
  (gen_random_uuid()::text, 'Beef Kottu', 'beef-kottu', 'Chopped godamba roti stir-fried on the hot plate with vegetables, egg and spices.', 1100, 1550, 'Normal', false, false, 2, (SELECT "id" FROM "Category" WHERE "slug" = 'kottu'), NOW()),
  (gen_random_uuid()::text, 'Seafood Kottu', 'seafood-kottu', 'Chopped godamba roti stir-fried on the hot plate with vegetables, egg and spices.', 1200, 1650, 'Normal', false, false, 3, (SELECT "id" FROM "Category" WHERE "slug" = 'kottu'), NOW()),
  (gen_random_uuid()::text, 'Mixed Kottu', 'mixed-kottu', 'Chopped godamba roti stir-fried on the hot plate with vegetables, egg and spices.', 1300, 1800, 'Normal', false, false, 4, (SELECT "id" FROM "Category" WHERE "slug" = 'kottu'), NOW()),
  (gen_random_uuid()::text, 'Egg Cheese Kottu', 'egg-cheese-kottu', 'Our kottu tossed with rich, melted cheese.', 1000, NULL, 'Normal', false, false, 5, (SELECT "id" FROM "Category" WHERE "slug" = 'kottu'), NOW()),
  (gen_random_uuid()::text, 'Chicken Cheese Kottu', 'chicken-cheese-kottu', 'Our kottu tossed with rich, melted cheese.', 1300, NULL, 'Normal', false, true, 6, (SELECT "id" FROM "Category" WHERE "slug" = 'kottu'), NOW()),
  (gen_random_uuid()::text, 'Beef Cheese Kottu', 'beef-cheese-kottu', 'Our kottu tossed with rich, melted cheese.', 1400, NULL, 'Normal', false, false, 7, (SELECT "id" FROM "Category" WHERE "slug" = 'kottu'), NOW()),
  (gen_random_uuid()::text, 'Seafood Cheese Kottu', 'seafood-cheese-kottu', 'Our kottu tossed with rich, melted cheese.', 1400, NULL, 'Normal', false, false, 8, (SELECT "id" FROM "Category" WHERE "slug" = 'kottu'), NOW()),
  (gen_random_uuid()::text, 'Mixed Cheese Kottu', 'mixed-cheese-kottu', 'Our kottu tossed with rich, melted cheese.', 2000, NULL, 'Normal', false, false, 9, (SELECT "id" FROM "Category" WHERE "slug" = 'kottu'), NOW()),
  (gen_random_uuid()::text, 'Egg Dolphin Kottu', 'egg-dolphin-kottu', 'Kottu made with soft dolphin (string) roti.', 900, NULL, 'Normal', false, false, 10, (SELECT "id" FROM "Category" WHERE "slug" = 'kottu'), NOW()),
  (gen_random_uuid()::text, 'Chicken Dolphin Kottu', 'chicken-dolphin-kottu', 'Kottu made with soft dolphin (string) roti.', 1200, NULL, 'Normal', false, false, 11, (SELECT "id" FROM "Category" WHERE "slug" = 'kottu'), NOW()),
  (gen_random_uuid()::text, 'Beef Dolphin Kottu', 'beef-dolphin-kottu', 'Kottu made with soft dolphin (string) roti.', 1300, NULL, 'Normal', false, false, 12, (SELECT "id" FROM "Category" WHERE "slug" = 'kottu'), NOW()),
  (gen_random_uuid()::text, 'Seafood Dolphin Kottu', 'seafood-dolphin-kottu', 'Kottu made with soft dolphin (string) roti.', 1400, NULL, 'Normal', false, false, 13, (SELECT "id" FROM "Category" WHERE "slug" = 'kottu'), NOW()),
  (gen_random_uuid()::text, 'Mixed Dolphin Kottu', 'mixed-dolphin-kottu', 'Kottu made with soft dolphin (string) roti.', 1900, NULL, 'Normal', false, false, 14, (SELECT "id" FROM "Category" WHERE "slug" = 'kottu'), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "price" = EXCLUDED."price", "fullPrice" = EXCLUDED."fullPrice", "baseLabel" = EXCLUDED."baseLabel", "isVeg" = EXCLUDED."isVeg", "isFeatured" = EXCLUDED."isFeatured", "sortOrder" = EXCLUDED."sortOrder", "categoryId" = EXCLUDED."categoryId", "updatedAt" = NOW();

-- Rice
INSERT INTO "MenuItem" ("id", "name", "slug", "description", "price", "fullPrice", "baseLabel", "isVeg", "isFeatured", "sortOrder", "categoryId", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Vegetable Fried Rice', 'vegetable-fried-rice', 'Wok-tossed rice with vegetables, served with chilli paste.', 550, 850, 'Normal', true, false, 0, (SELECT "id" FROM "Category" WHERE "slug" = 'rice'), NOW()),
  (gen_random_uuid()::text, 'Egg Fried Rice', 'egg-fried-rice', 'Wok-tossed rice with vegetables, served with chilli paste.', 750, 1150, 'Normal', false, false, 1, (SELECT "id" FROM "Category" WHERE "slug" = 'rice'), NOW()),
  (gen_random_uuid()::text, 'Chicken Fried Rice', 'chicken-fried-rice', 'Wok-tossed rice with vegetables, served with chilli paste.', 1100, 2000, 'Normal', false, false, 2, (SELECT "id" FROM "Category" WHERE "slug" = 'rice'), NOW()),
  (gen_random_uuid()::text, 'Beef Fried Rice', 'beef-fried-rice', 'Wok-tossed rice with vegetables, served with chilli paste.', 1300, 2500, 'Normal', false, false, 3, (SELECT "id" FROM "Category" WHERE "slug" = 'rice'), NOW()),
  (gen_random_uuid()::text, 'Seafood Fried Rice', 'seafood-fried-rice', 'Wok-tossed rice with vegetables, served with chilli paste.', 1400, 2700, 'Normal', false, false, 4, (SELECT "id" FROM "Category" WHERE "slug" = 'rice'), NOW()),
  (gen_random_uuid()::text, 'Mutton Fried Rice', 'mutton-fried-rice', 'Wok-tossed rice with vegetables, served with chilli paste.', 1200, 2300, 'Normal', false, false, 5, (SELECT "id" FROM "Category" WHERE "slug" = 'rice'), NOW()),
  (gen_random_uuid()::text, 'Mixed Fried Rice', 'mixed-fried-rice', 'Wok-tossed rice with vegetables, served with chilli paste.', 1500, 2800, 'Normal', false, false, 6, (SELECT "id" FROM "Category" WHERE "slug" = 'rice'), NOW()),
  (gen_random_uuid()::text, 'Chicken Nasi Goreng', 'chicken-nasi-goreng', 'Spicy Indonesian-style fried rice.', 1250, 2200, 'Normal', false, true, 7, (SELECT "id" FROM "Category" WHERE "slug" = 'rice'), NOW()),
  (gen_random_uuid()::text, 'Beef Nasi Goreng', 'beef-nasi-goreng', 'Spicy Indonesian-style fried rice.', 1450, 2600, 'Normal', false, false, 8, (SELECT "id" FROM "Category" WHERE "slug" = 'rice'), NOW()),
  (gen_random_uuid()::text, 'Seafood Nasi Goreng', 'seafood-nasi-goreng', 'Spicy Indonesian-style fried rice.', 1550, 2800, 'Normal', false, false, 9, (SELECT "id" FROM "Category" WHERE "slug" = 'rice'), NOW()),
  (gen_random_uuid()::text, 'Mixed Nasi Goreng', 'mixed-nasi-goreng', 'Spicy Indonesian-style fried rice.', 1650, 2900, 'Normal', false, false, 10, (SELECT "id" FROM "Category" WHERE "slug" = 'rice'), NOW()),
  (gen_random_uuid()::text, 'Chicken Mongolian Rice', 'chicken-mongolian-rice', 'Mongolian-style fried rice with a rich sauce.', 1200, 2500, 'Normal', false, false, 11, (SELECT "id" FROM "Category" WHERE "slug" = 'rice'), NOW()),
  (gen_random_uuid()::text, 'Beef Mongolian Rice', 'beef-mongolian-rice', 'Mongolian-style fried rice with a rich sauce.', 1400, 2700, 'Normal', false, false, 12, (SELECT "id" FROM "Category" WHERE "slug" = 'rice'), NOW()),
  (gen_random_uuid()::text, 'Seafood Mongolian Rice', 'seafood-mongolian-rice', 'Mongolian-style fried rice with a rich sauce.', 1500, 2900, 'Normal', false, false, 13, (SELECT "id" FROM "Category" WHERE "slug" = 'rice'), NOW()),
  (gen_random_uuid()::text, 'Mixed Mongolian Rice', 'mixed-mongolian-rice', 'Mongolian-style fried rice with a rich sauce.', 1600, 3200, 'Normal', false, false, 14, (SELECT "id" FROM "Category" WHERE "slug" = 'rice'), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "price" = EXCLUDED."price", "fullPrice" = EXCLUDED."fullPrice", "baseLabel" = EXCLUDED."baseLabel", "isVeg" = EXCLUDED."isVeg", "isFeatured" = EXCLUDED."isFeatured", "sortOrder" = EXCLUDED."sortOrder", "categoryId" = EXCLUDED."categoryId", "updatedAt" = NOW();

-- Biriyani & Platters
INSERT INTO "MenuItem" ("id", "name", "slug", "description", "price", "fullPrice", "baseLabel", "isVeg", "isFeatured", "sortOrder", "categoryId", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Vegetable Biriyani', 'vegetable-biriyani', 'Fragrant biriyani rice slow-cooked with spices.', 800, 1500, 'Normal', true, false, 0, (SELECT "id" FROM "Category" WHERE "slug" = 'biriyani-platters'), NOW()),
  (gen_random_uuid()::text, 'Chicken Biriyani', 'chicken-biriyani', 'Fragrant biriyani rice slow-cooked with spices.', 1000, 1900, 'Normal', false, true, 1, (SELECT "id" FROM "Category" WHERE "slug" = 'biriyani-platters'), NOW()),
  (gen_random_uuid()::text, 'Beef Biriyani', 'beef-biriyani', 'Fragrant biriyani rice slow-cooked with spices.', 1300, 2200, 'Normal', false, false, 2, (SELECT "id" FROM "Category" WHERE "slug" = 'biriyani-platters'), NOW()),
  (gen_random_uuid()::text, 'Mutton Biriyani', 'mutton-biriyani', 'Fragrant biriyani rice slow-cooked with spices.', 1800, 3500, 'Normal', false, false, 3, (SELECT "id" FROM "Category" WHERE "slug" = 'biriyani-platters'), NOW()),
  (gen_random_uuid()::text, 'Chicken Biriyani Sahan', 'chicken-biriyani-sahan', 'Biriyani sharing platter. Comes with a free soft drink.', 4800, NULL, 'Normal', false, false, 4, (SELECT "id" FROM "Category" WHERE "slug" = 'biriyani-platters'), NOW()),
  (gen_random_uuid()::text, 'Beef Biriyani Sahan', 'beef-biriyani-sahan', 'Biriyani sharing platter. Comes with a free soft drink.', 6500, NULL, 'Normal', false, false, 5, (SELECT "id" FROM "Category" WHERE "slug" = 'biriyani-platters'), NOW()),
  (gen_random_uuid()::text, 'Mutton Biriyani Sahan', 'mutton-biriyani-sahan', 'Biriyani sharing platter. Comes with a free soft drink.', 8500, NULL, 'Normal', false, false, 6, (SELECT "id" FROM "Category" WHERE "slug" = 'biriyani-platters'), NOW()),
  (gen_random_uuid()::text, 'Mixed Shawal', 'mixed-shawal', 'Our signature mixed sharing platter. Comes with a free soft drink.', 6800, NULL, 'Normal', false, true, 7, (SELECT "id" FROM "Category" WHERE "slug" = 'biriyani-platters'), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "price" = EXCLUDED."price", "fullPrice" = EXCLUDED."fullPrice", "baseLabel" = EXCLUDED."baseLabel", "isVeg" = EXCLUDED."isVeg", "isFeatured" = EXCLUDED."isFeatured", "sortOrder" = EXCLUDED."sortOrder", "categoryId" = EXCLUDED."categoryId", "updatedAt" = NOW();

-- Noodles
INSERT INTO "MenuItem" ("id", "name", "slug", "description", "price", "fullPrice", "baseLabel", "isVeg", "isFeatured", "sortOrder", "categoryId", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Vegetable Noodles', 'vegetable-noodles', 'Stir-fried noodles with vegetables.', 550, 850, 'Normal', true, false, 0, (SELECT "id" FROM "Category" WHERE "slug" = 'noodles'), NOW()),
  (gen_random_uuid()::text, 'Egg Noodles', 'egg-noodles', 'Stir-fried noodles with vegetables.', 650, 950, 'Normal', false, false, 1, (SELECT "id" FROM "Category" WHERE "slug" = 'noodles'), NOW()),
  (gen_random_uuid()::text, 'Chicken Noodles', 'chicken-noodles', 'Stir-fried noodles with vegetables.', 1000, 1300, 'Normal', false, false, 2, (SELECT "id" FROM "Category" WHERE "slug" = 'noodles'), NOW()),
  (gen_random_uuid()::text, 'Beef Noodles', 'beef-noodles', 'Stir-fried noodles with vegetables.', 1200, 1800, 'Normal', false, false, 3, (SELECT "id" FROM "Category" WHERE "slug" = 'noodles'), NOW()),
  (gen_random_uuid()::text, 'Seafood Noodles', 'seafood-noodles', 'Stir-fried noodles with vegetables.', 1300, 2000, 'Normal', false, false, 4, (SELECT "id" FROM "Category" WHERE "slug" = 'noodles'), NOW()),
  (gen_random_uuid()::text, 'Mixed Noodles', 'mixed-noodles', 'Stir-fried noodles with vegetables.', 1400, 2200, 'Normal', false, false, 5, (SELECT "id" FROM "Category" WHERE "slug" = 'noodles'), NOW()),
  (gen_random_uuid()::text, 'Chicken Maggi Noodles', 'chicken-maggi-noodles', 'Spicy stir-fried Maggi noodles.', 900, NULL, 'Normal', false, false, 6, (SELECT "id" FROM "Category" WHERE "slug" = 'noodles'), NOW()),
  (gen_random_uuid()::text, 'Beef Maggi Noodles', 'beef-maggi-noodles', 'Spicy stir-fried Maggi noodles.', 1000, NULL, 'Normal', false, false, 7, (SELECT "id" FROM "Category" WHERE "slug" = 'noodles'), NOW()),
  (gen_random_uuid()::text, 'Seafood Maggi Noodles', 'seafood-maggi-noodles', 'Spicy stir-fried Maggi noodles.', 1100, NULL, 'Normal', false, false, 8, (SELECT "id" FROM "Category" WHERE "slug" = 'noodles'), NOW()),
  (gen_random_uuid()::text, 'Mixed Maggi Noodles', 'mixed-maggi-noodles', 'Spicy stir-fried Maggi noodles.', 1250, NULL, 'Normal', false, false, 9, (SELECT "id" FROM "Category" WHERE "slug" = 'noodles'), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "price" = EXCLUDED."price", "fullPrice" = EXCLUDED."fullPrice", "baseLabel" = EXCLUDED."baseLabel", "isVeg" = EXCLUDED."isVeg", "isFeatured" = EXCLUDED."isFeatured", "sortOrder" = EXCLUDED."sortOrder", "categoryId" = EXCLUDED."categoryId", "updatedAt" = NOW();

-- String Hoppers
INSERT INTO "MenuItem" ("id", "name", "slug", "description", "price", "fullPrice", "baseLabel", "isVeg", "isFeatured", "sortOrder", "categoryId", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Egg String Hoppers', 'egg-string-hoppers', 'String hoppers tossed with vegetables and spices.', 700, 1100, 'Normal', false, false, 0, (SELECT "id" FROM "Category" WHERE "slug" = 'string-hoppers'), NOW()),
  (gen_random_uuid()::text, 'Chicken String Hoppers', 'chicken-string-hoppers', 'String hoppers tossed with vegetables and spices.', 900, 1300, 'Normal', false, false, 1, (SELECT "id" FROM "Category" WHERE "slug" = 'string-hoppers'), NOW()),
  (gen_random_uuid()::text, 'Beef String Hoppers', 'beef-string-hoppers', 'String hoppers tossed with vegetables and spices.', 1100, 1500, 'Normal', false, false, 2, (SELECT "id" FROM "Category" WHERE "slug" = 'string-hoppers'), NOW()),
  (gen_random_uuid()::text, 'Seafood String Hoppers', 'seafood-string-hoppers', 'String hoppers tossed with vegetables and spices.', 1200, 1700, 'Normal', false, false, 3, (SELECT "id" FROM "Category" WHERE "slug" = 'string-hoppers'), NOW()),
  (gen_random_uuid()::text, 'Mixed String Hoppers', 'mixed-string-hoppers', 'String hoppers tossed with vegetables and spices.', 1300, 1900, 'Normal', false, false, 4, (SELECT "id" FROM "Category" WHERE "slug" = 'string-hoppers'), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "price" = EXCLUDED."price", "fullPrice" = EXCLUDED."fullPrice", "baseLabel" = EXCLUDED."baseLabel", "isVeg" = EXCLUDED."isVeg", "isFeatured" = EXCLUDED."isFeatured", "sortOrder" = EXCLUDED."sortOrder", "categoryId" = EXCLUDED."categoryId", "updatedAt" = NOW();

-- BBQ & Tandoori
INSERT INTO "MenuItem" ("id", "name", "slug", "description", "price", "fullPrice", "baseLabel", "isVeg", "isFeatured", "sortOrder", "categoryId", "updatedAt") VALUES
  (gen_random_uuid()::text, 'BBQ Chicken', 'bbq-chicken', 'Chargrilled BBQ chicken.', 1600, 3000, 'Half', false, true, 0, (SELECT "id" FROM "Category" WHERE "slug" = 'bbq-tandoori'), NOW()),
  (gen_random_uuid()::text, 'BBQ Chicken Leg', 'bbq-chicken-leg', 'Chargrilled BBQ chicken leg.', 800, NULL, 'Normal', false, false, 1, (SELECT "id" FROM "Category" WHERE "slug" = 'bbq-tandoori'), NOW()),
  (gen_random_uuid()::text, 'BBQ Chicken Chest', 'bbq-chicken-chest', 'Chargrilled BBQ chicken breast.', 900, NULL, 'Normal', false, false, 2, (SELECT "id" FROM "Category" WHERE "slug" = 'bbq-tandoori'), NOW()),
  (gen_random_uuid()::text, 'Tandoori Chicken', 'tandoori-chicken', 'Chicken marinated in tandoori spices and roasted.', 1650, 3100, 'Half', false, false, 3, (SELECT "id" FROM "Category" WHERE "slug" = 'bbq-tandoori'), NOW()),
  (gen_random_uuid()::text, 'Tandoori Chicken Leg', 'tandoori-chicken-leg', 'Tandoori-roasted chicken leg.', 900, NULL, 'Normal', false, false, 4, (SELECT "id" FROM "Category" WHERE "slug" = 'bbq-tandoori'), NOW()),
  (gen_random_uuid()::text, 'Tandoori Chicken Chest', 'tandoori-chicken-chest', 'Tandoori-roasted chicken breast.', 1000, NULL, 'Normal', false, false, 5, (SELECT "id" FROM "Category" WHERE "slug" = 'bbq-tandoori'), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "price" = EXCLUDED."price", "fullPrice" = EXCLUDED."fullPrice", "baseLabel" = EXCLUDED."baseLabel", "isVeg" = EXCLUDED."isVeg", "isFeatured" = EXCLUDED."isFeatured", "sortOrder" = EXCLUDED."sortOrder", "categoryId" = EXCLUDED."categoryId", "updatedAt" = NOW();

-- Curry & Gravy
INSERT INTO "MenuItem" ("id", "name", "slug", "description", "price", "fullPrice", "baseLabel", "isVeg", "isFeatured", "sortOrder", "categoryId", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Chicken Rara', 'chicken-rara', 'Indian special.', 1300, NULL, 'Normal', false, false, 0, (SELECT "id" FROM "Category" WHERE "slug" = 'curry-gravy'), NOW()),
  (gen_random_uuid()::text, 'Chicken Kolhapuri', 'chicken-kolhapuri', 'Indian special.', 1100, NULL, 'Normal', false, false, 1, (SELECT "id" FROM "Category" WHERE "slug" = 'curry-gravy'), NOW()),
  (gen_random_uuid()::text, 'Chicken Lababdar', 'chicken-lababdar', 'Indian special.', 1100, NULL, 'Normal', false, false, 2, (SELECT "id" FROM "Category" WHERE "slug" = 'curry-gravy'), NOW()),
  (gen_random_uuid()::text, 'Chicken Tikka Masala', 'chicken-tikka-masala', 'Indian special.', 1200, NULL, 'Normal', false, false, 3, (SELECT "id" FROM "Category" WHERE "slug" = 'curry-gravy'), NOW()),
  (gen_random_uuid()::text, 'Beef Tikka Masala', 'beef-tikka-masala', 'Indian special.', 1350, NULL, 'Normal', false, false, 4, (SELECT "id" FROM "Category" WHERE "slug" = 'curry-gravy'), NOW()),
  (gen_random_uuid()::text, 'Chicken Kadai', 'chicken-kadai', 'Cooked kadai-style with peppers, onion and spices.', 1000, NULL, 'Normal', false, false, 5, (SELECT "id" FROM "Category" WHERE "slug" = 'curry-gravy'), NOW()),
  (gen_random_uuid()::text, 'Beef Kadai', 'beef-kadai', 'Cooked kadai-style with peppers, onion and spices.', 1200, NULL, 'Normal', false, false, 6, (SELECT "id" FROM "Category" WHERE "slug" = 'curry-gravy'), NOW()),
  (gen_random_uuid()::text, 'Paneer Kadai', 'paneer-kadai', 'Cooked kadai-style with peppers, onion and spices.', 1000, NULL, 'Normal', true, false, 7, (SELECT "id" FROM "Category" WHERE "slug" = 'curry-gravy'), NOW()),
  (gen_random_uuid()::text, 'Mutton Kadai', 'mutton-kadai', 'Cooked kadai-style with peppers, onion and spices.', 1500, NULL, 'Normal', false, false, 8, (SELECT "id" FROM "Category" WHERE "slug" = 'curry-gravy'), NOW()),
  (gen_random_uuid()::text, 'Chicken Korma', 'chicken-korma', 'Mild, creamy korma curry.', 1000, NULL, 'Normal', false, false, 9, (SELECT "id" FROM "Category" WHERE "slug" = 'curry-gravy'), NOW()),
  (gen_random_uuid()::text, 'Beef Korma', 'beef-korma', 'Mild, creamy korma curry.', 1200, NULL, 'Normal', false, false, 10, (SELECT "id" FROM "Category" WHERE "slug" = 'curry-gravy'), NOW()),
  (gen_random_uuid()::text, 'Paneer Korma', 'paneer-korma', 'Mild, creamy korma curry.', 1000, NULL, 'Normal', true, false, 11, (SELECT "id" FROM "Category" WHERE "slug" = 'curry-gravy'), NOW()),
  (gen_random_uuid()::text, 'Mutton Korma', 'mutton-korma', 'Mild, creamy korma curry.', 1550, NULL, 'Normal', false, false, 12, (SELECT "id" FROM "Category" WHERE "slug" = 'curry-gravy'), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "price" = EXCLUDED."price", "fullPrice" = EXCLUDED."fullPrice", "baseLabel" = EXCLUDED."baseLabel", "isVeg" = EXCLUDED."isVeg", "isFeatured" = EXCLUDED."isFeatured", "sortOrder" = EXCLUDED."sortOrder", "categoryId" = EXCLUDED."categoryId", "updatedAt" = NOW();

-- Parotta
INSERT INTO "MenuItem" ("id", "name", "slug", "description", "price", "fullPrice", "baseLabel", "isVeg", "isFeatured", "sortOrder", "categoryId", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Plain Parotta', 'plain-parotta', '', 60, NULL, 'Normal', true, false, 0, (SELECT "id" FROM "Category" WHERE "slug" = 'parotta'), NOW()),
  (gen_random_uuid()::text, 'Ghee Parotta', 'ghee-parotta', '', 120, NULL, 'Normal', true, false, 1, (SELECT "id" FROM "Category" WHERE "slug" = 'parotta'), NOW()),
  (gen_random_uuid()::text, 'Garlic Parotta', 'garlic-parotta', '', 120, NULL, 'Normal', true, false, 2, (SELECT "id" FROM "Category" WHERE "slug" = 'parotta'), NOW()),
  (gen_random_uuid()::text, 'Sugar Parotta', 'sugar-parotta', '', 120, NULL, 'Normal', true, false, 3, (SELECT "id" FROM "Category" WHERE "slug" = 'parotta'), NOW()),
  (gen_random_uuid()::text, 'Banana Parotta', 'banana-parotta', '', 150, NULL, 'Normal', true, false, 4, (SELECT "id" FROM "Category" WHERE "slug" = 'parotta'), NOW()),
  (gen_random_uuid()::text, 'Egg Roti', 'egg-roti', '', 150, NULL, 'Normal', false, false, 5, (SELECT "id" FROM "Category" WHERE "slug" = 'parotta'), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "price" = EXCLUDED."price", "fullPrice" = EXCLUDED."fullPrice", "baseLabel" = EXCLUDED."baseLabel", "isVeg" = EXCLUDED."isVeg", "isFeatured" = EXCLUDED."isFeatured", "sortOrder" = EXCLUDED."sortOrder", "categoryId" = EXCLUDED."categoryId", "updatedAt" = NOW();

-- Starters
INSERT INTO "MenuItem" ("id", "name", "slug", "description", "price", "fullPrice", "baseLabel", "isVeg", "isFeatured", "sortOrder", "categoryId", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Sweet Corn Veg Soup', 'sweet-corn-veg-soup', '', 350, NULL, 'Normal', true, false, 0, (SELECT "id" FROM "Category" WHERE "slug" = 'starters'), NOW()),
  (gen_random_uuid()::text, 'Chicken Sweet Corn Soup', 'chicken-sweet-corn-soup', '', 600, NULL, 'Normal', false, false, 1, (SELECT "id" FROM "Category" WHERE "slug" = 'starters'), NOW()),
  (gen_random_uuid()::text, 'Hot & Sour Chicken Soup', 'hot-sour-chicken-soup', '', 500, NULL, 'Normal', false, false, 2, (SELECT "id" FROM "Category" WHERE "slug" = 'starters'), NOW()),
  (gen_random_uuid()::text, 'French Fries', 'french-fries', '', 600, NULL, 'Normal', true, false, 3, (SELECT "id" FROM "Category" WHERE "slug" = 'starters'), NOW()),
  (gen_random_uuid()::text, 'Mini Kives', 'mini-kives', '', 90, NULL, 'Normal', false, false, 4, (SELECT "id" FROM "Category" WHERE "slug" = 'starters'), NOW()),
  (gen_random_uuid()::text, 'Chicken Drumsticks', 'chicken-drumsticks', '', 130, NULL, 'Normal', false, false, 5, (SELECT "id" FROM "Category" WHERE "slug" = 'starters'), NOW()),
  (gen_random_uuid()::text, 'Crispy Chicken', 'crispy-chicken', '', 800, NULL, 'Normal', false, false, 6, (SELECT "id" FROM "Category" WHERE "slug" = 'starters'), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "price" = EXCLUDED."price", "fullPrice" = EXCLUDED."fullPrice", "baseLabel" = EXCLUDED."baseLabel", "isVeg" = EXCLUDED."isVeg", "isFeatured" = EXCLUDED."isFeatured", "sortOrder" = EXCLUDED."sortOrder", "categoryId" = EXCLUDED."categoryId", "updatedAt" = NOW();

-- Side Dishes
INSERT INTO "MenuItem" ("id", "name", "slug", "description", "price", "fullPrice", "baseLabel", "isVeg", "isFeatured", "sortOrder", "categoryId", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Fried Chicken', 'fried-chicken', '', 700, NULL, 'Normal', false, false, 0, (SELECT "id" FROM "Category" WHERE "slug" = 'side-dishes'), NOW()),
  (gen_random_uuid()::text, 'Chicken Devilled', 'chicken-devilled', '', 1200, NULL, 'Normal', false, false, 1, (SELECT "id" FROM "Category" WHERE "slug" = 'side-dishes'), NOW()),
  (gen_random_uuid()::text, 'Fish Devilled', 'fish-devilled', '', 1200, NULL, 'Normal', false, false, 2, (SELECT "id" FROM "Category" WHERE "slug" = 'side-dishes'), NOW()),
  (gen_random_uuid()::text, 'Beef Devilled', 'beef-devilled', '', 1300, NULL, 'Normal', false, false, 3, (SELECT "id" FROM "Category" WHERE "slug" = 'side-dishes'), NOW()),
  (gen_random_uuid()::text, 'Paneer Devilled', 'paneer-devilled', '', 1400, NULL, 'Normal', true, false, 4, (SELECT "id" FROM "Category" WHERE "slug" = 'side-dishes'), NOW()),
  (gen_random_uuid()::text, 'Chicken 65 (200g)', 'chicken-65-200g', '', 1000, NULL, 'Normal', false, false, 5, (SELECT "id" FROM "Category" WHERE "slug" = 'side-dishes'), NOW()),
  (gen_random_uuid()::text, 'Seafood Devilled', 'seafood-devilled', '', 1400, NULL, 'Normal', false, false, 6, (SELECT "id" FROM "Category" WHERE "slug" = 'side-dishes'), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "price" = EXCLUDED."price", "fullPrice" = EXCLUDED."fullPrice", "baseLabel" = EXCLUDED."baseLabel", "isVeg" = EXCLUDED."isVeg", "isFeatured" = EXCLUDED."isFeatured", "sortOrder" = EXCLUDED."sortOrder", "categoryId" = EXCLUDED."categoryId", "updatedAt" = NOW();

-- Omelettes
INSERT INTO "MenuItem" ("id", "name", "slug", "description", "price", "fullPrice", "baseLabel", "isVeg", "isFeatured", "sortOrder", "categoryId", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Normal Omelette', 'normal-omelette', '', 130, NULL, 'Normal', false, false, 0, (SELECT "id" FROM "Category" WHERE "slug" = 'omelettes'), NOW()),
  (gen_random_uuid()::text, 'Bullseye', 'bullseye', '', 130, NULL, 'Normal', false, false, 1, (SELECT "id" FROM "Category" WHERE "slug" = 'omelettes'), NOW()),
  (gen_random_uuid()::text, 'Chicken Omelette', 'chicken-omelette', '', 350, NULL, 'Normal', false, false, 2, (SELECT "id" FROM "Category" WHERE "slug" = 'omelettes'), NOW()),
  (gen_random_uuid()::text, 'Cheese Omelette', 'cheese-omelette', '', 450, NULL, 'Normal', false, false, 3, (SELECT "id" FROM "Category" WHERE "slug" = 'omelettes'), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "price" = EXCLUDED."price", "fullPrice" = EXCLUDED."fullPrice", "baseLabel" = EXCLUDED."baseLabel", "isVeg" = EXCLUDED."isVeg", "isFeatured" = EXCLUDED."isFeatured", "sortOrder" = EXCLUDED."sortOrder", "categoryId" = EXCLUDED."categoryId", "updatedAt" = NOW();

-- Bread & Bites
INSERT INTO "MenuItem" ("id", "name", "slug", "description", "price", "fullPrice", "baseLabel", "isVeg", "isFeatured", "sortOrder", "categoryId", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Chicken Submarine', 'chicken-submarine', '', 1000, NULL, 'Normal', false, false, 0, (SELECT "id" FROM "Category" WHERE "slug" = 'bread-bites'), NOW()),
  (gen_random_uuid()::text, 'Crispy Chicken Submarine', 'crispy-chicken-submarine', '', 1100, NULL, 'Normal', false, false, 1, (SELECT "id" FROM "Category" WHERE "slug" = 'bread-bites'), NOW()),
  (gen_random_uuid()::text, 'Beef Submarine', 'beef-submarine', '', 1200, NULL, 'Normal', false, false, 2, (SELECT "id" FROM "Category" WHERE "slug" = 'bread-bites'), NOW()),
  (gen_random_uuid()::text, 'Chicken Burger', 'chicken-burger', '', 900, NULL, 'Normal', false, false, 3, (SELECT "id" FROM "Category" WHERE "slug" = 'bread-bites'), NOW()),
  (gen_random_uuid()::text, 'Crispy Chicken Burger', 'crispy-chicken-burger', '', 1000, NULL, 'Normal', false, false, 4, (SELECT "id" FROM "Category" WHERE "slug" = 'bread-bites'), NOW()),
  (gen_random_uuid()::text, 'Beef Burger', 'beef-burger', '', 1100, NULL, 'Normal', false, false, 5, (SELECT "id" FROM "Category" WHERE "slug" = 'bread-bites'), NOW()),
  (gen_random_uuid()::text, 'Egg Club Sandwich', 'egg-club-sandwich', '', 600, NULL, 'Normal', false, false, 6, (SELECT "id" FROM "Category" WHERE "slug" = 'bread-bites'), NOW()),
  (gen_random_uuid()::text, 'Chicken Club Sandwich', 'chicken-club-sandwich', '', 800, NULL, 'Normal', false, false, 7, (SELECT "id" FROM "Category" WHERE "slug" = 'bread-bites'), NOW()),
  (gen_random_uuid()::text, 'Beef Club Sandwich', 'beef-club-sandwich', '', 1000, NULL, 'Normal', false, false, 8, (SELECT "id" FROM "Category" WHERE "slug" = 'bread-bites'), NOW()),
  (gen_random_uuid()::text, 'Chicken Shawarma', 'chicken-shawarma', '', 1000, NULL, 'Normal', false, false, 9, (SELECT "id" FROM "Category" WHERE "slug" = 'bread-bites'), NOW()),
  (gen_random_uuid()::text, 'Crispy Chicken Shawarma', 'crispy-chicken-shawarma', '', 1100, NULL, 'Normal', false, false, 10, (SELECT "id" FROM "Category" WHERE "slug" = 'bread-bites'), NOW()),
  (gen_random_uuid()::text, 'Beef Shawarma', 'beef-shawarma', '', 1200, NULL, 'Normal', false, false, 11, (SELECT "id" FROM "Category" WHERE "slug" = 'bread-bites'), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "price" = EXCLUDED."price", "fullPrice" = EXCLUDED."fullPrice", "baseLabel" = EXCLUDED."baseLabel", "isVeg" = EXCLUDED."isVeg", "isFeatured" = EXCLUDED."isFeatured", "sortOrder" = EXCLUDED."sortOrder", "categoryId" = EXCLUDED."categoryId", "updatedAt" = NOW();

-- Desserts & Ice Cream
INSERT INTO "MenuItem" ("id", "name", "slug", "description", "price", "fullPrice", "baseLabel", "isVeg", "isFeatured", "sortOrder", "categoryId", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Brownie', 'brownie', '', 250, NULL, 'Normal', true, false, 0, (SELECT "id" FROM "Category" WHERE "slug" = 'desserts-ice-cream'), NOW()),
  (gen_random_uuid()::text, 'Brownie with Ice Cream', 'brownie-with-ice-cream', '', 450, NULL, 'Normal', true, false, 1, (SELECT "id" FROM "Category" WHERE "slug" = 'desserts-ice-cream'), NOW()),
  (gen_random_uuid()::text, 'Fruit Salad with Ice Cream', 'fruit-salad-with-ice-cream', '', 600, NULL, 'Normal', true, false, 2, (SELECT "id" FROM "Category" WHERE "slug" = 'desserts-ice-cream'), NOW()),
  (gen_random_uuid()::text, 'Fruit Salad', 'fruit-salad', '', 500, NULL, 'Normal', true, false, 3, (SELECT "id" FROM "Category" WHERE "slug" = 'desserts-ice-cream'), NOW()),
  (gen_random_uuid()::text, 'Watalappam', 'watalappam', '', 200, NULL, 'Normal', true, false, 4, (SELECT "id" FROM "Category" WHERE "slug" = 'desserts-ice-cream'), NOW()),
  (gen_random_uuid()::text, 'Vanilla Ice Cream', 'vanilla-ice-cream', '', 350, NULL, 'Normal', true, false, 5, (SELECT "id" FROM "Category" WHERE "slug" = 'desserts-ice-cream'), NOW()),
  (gen_random_uuid()::text, 'Chocolate Ice Cream', 'chocolate-ice-cream', '', 350, NULL, 'Normal', true, false, 6, (SELECT "id" FROM "Category" WHERE "slug" = 'desserts-ice-cream'), NOW()),
  (gen_random_uuid()::text, 'Strawberry Ice Cream', 'strawberry-ice-cream', '', 350, NULL, 'Normal', true, false, 7, (SELECT "id" FROM "Category" WHERE "slug" = 'desserts-ice-cream'), NOW()),
  (gen_random_uuid()::text, 'Mixed Ice Cream', 'mixed-ice-cream', '', 450, NULL, 'Normal', true, false, 8, (SELECT "id" FROM "Category" WHERE "slug" = 'desserts-ice-cream'), NOW()),
  (gen_random_uuid()::text, 'Fruit & Nut Ice Cream', 'fruit-nut-ice-cream', '', 400, NULL, 'Normal', true, false, 9, (SELECT "id" FROM "Category" WHERE "slug" = 'desserts-ice-cream'), NOW()),
  (gen_random_uuid()::text, 'Kids Ice Cream', 'kids-ice-cream', '', 200, NULL, 'Normal', true, false, 10, (SELECT "id" FROM "Category" WHERE "slug" = 'desserts-ice-cream'), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "price" = EXCLUDED."price", "fullPrice" = EXCLUDED."fullPrice", "baseLabel" = EXCLUDED."baseLabel", "isVeg" = EXCLUDED."isVeg", "isFeatured" = EXCLUDED."isFeatured", "sortOrder" = EXCLUDED."sortOrder", "categoryId" = EXCLUDED."categoryId", "updatedAt" = NOW();

-- Fresh Juices
INSERT INTO "MenuItem" ("id", "name", "slug", "description", "price", "fullPrice", "baseLabel", "isVeg", "isFeatured", "sortOrder", "categoryId", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Lemon Juice', 'lemon-juice', '', 350, NULL, 'Normal', true, false, 0, (SELECT "id" FROM "Category" WHERE "slug" = 'fresh-juices'), NOW()),
  (gen_random_uuid()::text, 'Orange Juice', 'orange-juice', '', 500, NULL, 'Normal', true, false, 1, (SELECT "id" FROM "Category" WHERE "slug" = 'fresh-juices'), NOW()),
  (gen_random_uuid()::text, 'Mango Juice', 'mango-juice', '', 450, NULL, 'Normal', true, false, 2, (SELECT "id" FROM "Category" WHERE "slug" = 'fresh-juices'), NOW()),
  (gen_random_uuid()::text, 'Papaya Juice', 'papaya-juice', '', 300, NULL, 'Normal', true, false, 3, (SELECT "id" FROM "Category" WHERE "slug" = 'fresh-juices'), NOW()),
  (gen_random_uuid()::text, 'Avocado Juice', 'avocado-juice', '', 450, NULL, 'Normal', true, false, 4, (SELECT "id" FROM "Category" WHERE "slug" = 'fresh-juices'), NOW()),
  (gen_random_uuid()::text, 'Apple Juice', 'apple-juice', '', 500, NULL, 'Normal', true, false, 5, (SELECT "id" FROM "Category" WHERE "slug" = 'fresh-juices'), NOW()),
  (gen_random_uuid()::text, 'Passion Fruit Juice', 'passion-fruit-juice', '', 400, NULL, 'Normal', true, false, 6, (SELECT "id" FROM "Category" WHERE "slug" = 'fresh-juices'), NOW()),
  (gen_random_uuid()::text, 'Watermelon Juice', 'watermelon-juice', '', 350, NULL, 'Normal', true, false, 7, (SELECT "id" FROM "Category" WHERE "slug" = 'fresh-juices'), NOW()),
  (gen_random_uuid()::text, 'Pineapple Juice', 'pineapple-juice', '', 400, NULL, 'Normal', true, false, 8, (SELECT "id" FROM "Category" WHERE "slug" = 'fresh-juices'), NOW()),
  (gen_random_uuid()::text, 'Pumpkin Juice', 'pumpkin-juice', '', 400, NULL, 'Normal', true, false, 9, (SELECT "id" FROM "Category" WHERE "slug" = 'fresh-juices'), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "price" = EXCLUDED."price", "fullPrice" = EXCLUDED."fullPrice", "baseLabel" = EXCLUDED."baseLabel", "isVeg" = EXCLUDED."isVeg", "isFeatured" = EXCLUDED."isFeatured", "sortOrder" = EXCLUDED."sortOrder", "categoryId" = EXCLUDED."categoryId", "updatedAt" = NOW();

-- Shakes & Lassi
INSERT INTO "MenuItem" ("id", "name", "slug", "description", "price", "fullPrice", "baseLabel", "isVeg", "isFeatured", "sortOrder", "categoryId", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Banana Shake', 'banana-shake', '', 500, NULL, 'Normal', true, false, 0, (SELECT "id" FROM "Category" WHERE "slug" = 'shakes-lassi'), NOW()),
  (gen_random_uuid()::text, 'Mango Shake', 'mango-shake', '', 700, NULL, 'Normal', true, false, 1, (SELECT "id" FROM "Category" WHERE "slug" = 'shakes-lassi'), NOW()),
  (gen_random_uuid()::text, 'Strawberry Shake', 'strawberry-shake', '', 600, NULL, 'Normal', true, false, 2, (SELECT "id" FROM "Category" WHERE "slug" = 'shakes-lassi'), NOW()),
  (gen_random_uuid()::text, 'Avocado Shake', 'avocado-shake', '', 700, NULL, 'Normal', true, false, 3, (SELECT "id" FROM "Category" WHERE "slug" = 'shakes-lassi'), NOW()),
  (gen_random_uuid()::text, 'Almond Shake', 'almond-shake', '', 750, NULL, 'Normal', true, false, 4, (SELECT "id" FROM "Category" WHERE "slug" = 'shakes-lassi'), NOW()),
  (gen_random_uuid()::text, 'Vanilla Shake', 'vanilla-shake', '', 600, NULL, 'Normal', true, false, 5, (SELECT "id" FROM "Category" WHERE "slug" = 'shakes-lassi'), NOW()),
  (gen_random_uuid()::text, 'Chocolate Shake', 'chocolate-shake', '', 600, NULL, 'Normal', true, false, 6, (SELECT "id" FROM "Category" WHERE "slug" = 'shakes-lassi'), NOW()),
  (gen_random_uuid()::text, 'Snickers Shake', 'snickers-shake', '', 800, NULL, 'Normal', true, false, 7, (SELECT "id" FROM "Category" WHERE "slug" = 'shakes-lassi'), NOW()),
  (gen_random_uuid()::text, 'Ice Milo Shake', 'ice-milo-shake', '', 600, NULL, 'Normal', true, false, 8, (SELECT "id" FROM "Category" WHERE "slug" = 'shakes-lassi'), NOW()),
  (gen_random_uuid()::text, 'Sweet Lassi', 'sweet-lassi', '', 450, NULL, 'Normal', true, false, 9, (SELECT "id" FROM "Category" WHERE "slug" = 'shakes-lassi'), NOW()),
  (gen_random_uuid()::text, 'Mango Lassi', 'mango-lassi', '', 650, NULL, 'Normal', true, false, 10, (SELECT "id" FROM "Category" WHERE "slug" = 'shakes-lassi'), NOW()),
  (gen_random_uuid()::text, 'Banana Lassi', 'banana-lassi', '', 500, NULL, 'Normal', true, false, 11, (SELECT "id" FROM "Category" WHERE "slug" = 'shakes-lassi'), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "price" = EXCLUDED."price", "fullPrice" = EXCLUDED."fullPrice", "baseLabel" = EXCLUDED."baseLabel", "isVeg" = EXCLUDED."isVeg", "isFeatured" = EXCLUDED."isFeatured", "sortOrder" = EXCLUDED."sortOrder", "categoryId" = EXCLUDED."categoryId", "updatedAt" = NOW();

-- Mojitos & Specials
INSERT INTO "MenuItem" ("id", "name", "slug", "description", "price", "fullPrice", "baseLabel", "isVeg", "isFeatured", "sortOrder", "categoryId", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Strawberry Mojito', 'strawberry-mojito', '', 600, NULL, 'Normal', true, false, 0, (SELECT "id" FROM "Category" WHERE "slug" = 'mojitos-specials'), NOW()),
  (gen_random_uuid()::text, 'Blackberry Mojito', 'blackberry-mojito', '', 600, NULL, 'Normal', true, false, 1, (SELECT "id" FROM "Category" WHERE "slug" = 'mojitos-specials'), NOW()),
  (gen_random_uuid()::text, 'Classic Mojito', 'classic-mojito', '', 600, NULL, 'Normal', true, false, 2, (SELECT "id" FROM "Category" WHERE "slug" = 'mojitos-specials'), NOW()),
  (gen_random_uuid()::text, 'Pomegranate Mojito', 'pomegranate-mojito', '', 600, NULL, 'Normal', true, false, 3, (SELECT "id" FROM "Category" WHERE "slug" = 'mojitos-specials'), NOW()),
  (gen_random_uuid()::text, 'Lemon Margarita', 'lemon-margarita', '', 550, NULL, 'Normal', true, false, 4, (SELECT "id" FROM "Category" WHERE "slug" = 'mojitos-specials'), NOW()),
  (gen_random_uuid()::text, 'Strawberry Margarita', 'strawberry-margarita', '', 550, NULL, 'Normal', true, false, 5, (SELECT "id" FROM "Category" WHERE "slug" = 'mojitos-specials'), NOW()),
  (gen_random_uuid()::text, 'Lime with Mint', 'lime-with-mint', '', 600, NULL, 'Normal', true, false, 6, (SELECT "id" FROM "Category" WHERE "slug" = 'mojitos-specials'), NOW()),
  (gen_random_uuid()::text, 'Faluda', 'faluda', '', 450, NULL, 'Normal', true, false, 7, (SELECT "id" FROM "Category" WHERE "slug" = 'mojitos-specials'), NOW()),
  (gen_random_uuid()::text, 'Mixed Fruit Special', 'mixed-fruit-special', '', 750, NULL, 'Normal', true, false, 8, (SELECT "id" FROM "Category" WHERE "slug" = 'mojitos-specials'), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "price" = EXCLUDED."price", "fullPrice" = EXCLUDED."fullPrice", "baseLabel" = EXCLUDED."baseLabel", "isVeg" = EXCLUDED."isVeg", "isFeatured" = EXCLUDED."isFeatured", "sortOrder" = EXCLUDED."sortOrder", "categoryId" = EXCLUDED."categoryId", "updatedAt" = NOW();

-- Hot Drinks
INSERT INTO "MenuItem" ("id", "name", "slug", "description", "price", "fullPrice", "baseLabel", "isVeg", "isFeatured", "sortOrder", "categoryId", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Nescafe', 'nescafe', '', 150, NULL, 'Normal', true, false, 0, (SELECT "id" FROM "Category" WHERE "slug" = 'hot-drinks'), NOW()),
  (gen_random_uuid()::text, 'Cardamom Tea', 'cardamom-tea', '', 150, NULL, 'Normal', true, false, 1, (SELECT "id" FROM "Category" WHERE "slug" = 'hot-drinks'), NOW()),
  (gen_random_uuid()::text, 'Plain Tea', 'plain-tea', '', 100, NULL, 'Normal', true, false, 2, (SELECT "id" FROM "Category" WHERE "slug" = 'hot-drinks'), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "price" = EXCLUDED."price", "fullPrice" = EXCLUDED."fullPrice", "baseLabel" = EXCLUDED."baseLabel", "isVeg" = EXCLUDED."isVeg", "isFeatured" = EXCLUDED."isFeatured", "sortOrder" = EXCLUDED."sortOrder", "categoryId" = EXCLUDED."categoryId", "updatedAt" = NOW();

-- Drop sample categories that are now empty.
DELETE FROM "Category" c WHERE c."slug" IN ('rice-curry', 'fried-rice-noodles', 'devilled', 'short-eats', 'desserts', 'beverages') AND NOT EXISTS (SELECT 1 FROM "MenuItem" m WHERE m."categoryId" = c."id");
