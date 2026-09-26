// Golden Spoon's menu, transcribed from the printed menu card.
// Used by `npm run db:seed` and to generate the menu data migration.
// Prices are in LKR. `fullPrice` is set for dishes that come in Normal/Full (or Half/Full) portions.

export type MenuEntry = {
  name: string;
  price: number;
  fullPrice?: number;
  baseLabel?: "Normal" | "Half";
  isVeg?: boolean;
  isFeatured?: boolean;
  description?: string;
};

export type MenuCategory = { name: string; items: MenuEntry[] };

/** Builds the protein variants of one dish, e.g. Egg / Chicken / Beef Kottu. */
function variants(
  dish: string,
  rows: [string, number, number?][],
  description: string,
  opts: { vegFirstWord?: string[]; nameFirst?: boolean } = {},
): MenuEntry[] {
  const veg = opts.vegFirstWord ?? ["Vegetable", "Paneer"];
  return rows.map(([kind, price, fullPrice]) => ({
    name: opts.nameFirst ? `${dish} ${kind}` : `${kind} ${dish}`,
    price,
    ...(fullPrice ? { fullPrice } : {}),
    isVeg: veg.includes(kind),
    description,
  }));
}

export const MENU: MenuCategory[] = [
  {
    name: "Kottu",
    items: [
      ...variants(
        "Kottu",
        [
          ["Egg", 700, 1100],
          ["Chicken", 1000, 1300],
          ["Beef", 1100, 1550],
          ["Seafood", 1200, 1650],
          ["Mixed", 1300, 1800],
        ],
        "Chopped godamba roti stir-fried on the hot plate with vegetables, egg and spices.",
      ),
      ...variants(
        "Cheese Kottu",
        [
          ["Egg", 1000],
          ["Chicken", 1300],
          ["Beef", 1400],
          ["Seafood", 1400],
          ["Mixed", 2000],
        ],
        "Our kottu tossed with rich, melted cheese.",
      ),
      ...variants(
        "Dolphin Kottu",
        [
          ["Egg", 900],
          ["Chicken", 1200],
          ["Beef", 1300],
          ["Seafood", 1400],
          ["Mixed", 1900],
        ],
        "Kottu made with soft dolphin (string) roti.",
      ),
    ],
  },
  {
    name: "Rice",
    items: [
      ...variants(
        "Fried Rice",
        [
          ["Vegetable", 550, 850],
          ["Egg", 750, 1150],
          ["Chicken", 1100, 2000],
          ["Beef", 1300, 2500],
          ["Seafood", 1400, 2700],
          ["Mutton", 1200, 2300],
          ["Mixed", 1500, 2800],
        ],
        "Wok-tossed rice with vegetables, served with chilli paste.",
      ),
      ...variants(
        "Nasi Goreng",
        [
          ["Chicken", 1250, 2200],
          ["Beef", 1450, 2600],
          ["Seafood", 1550, 2800],
          ["Mixed", 1650, 2900],
        ],
        "Spicy Indonesian-style fried rice.",
      ),
      ...variants(
        "Mongolian Rice",
        [
          ["Chicken", 1200, 2500],
          ["Beef", 1400, 2700],
          ["Seafood", 1500, 2900],
          ["Mixed", 1600, 3200],
        ],
        "Mongolian-style fried rice with a rich sauce.",
      ),
    ],
  },
  {
    name: "Biriyani & Platters",
    items: [
      ...variants(
        "Biriyani",
        [
          ["Vegetable", 800, 1500],
          ["Chicken", 1000, 1900],
          ["Beef", 1300, 2200],
          ["Mutton", 1800, 3500],
        ],
        "Fragrant biriyani rice slow-cooked with spices.",
      ),
      ...variants(
        "Biriyani Sahan",
        [
          ["Chicken", 4800],
          ["Beef", 6500],
          ["Mutton", 8500],
        ],
        "Biriyani sharing platter. Comes with a free soft drink.",
      ),
      {
        name: "Mixed Shawal",
        price: 6800,
        isFeatured: true,
        description: "Our signature mixed sharing platter. Comes with a free soft drink.",
      },
    ],
  },
  {
    name: "Noodles",
    items: [
      ...variants(
        "Noodles",
        [
          ["Vegetable", 550, 850],
          ["Egg", 650, 950],
          ["Chicken", 1000, 1300],
          ["Beef", 1200, 1800],
          ["Seafood", 1300, 2000],
          ["Mixed", 1400, 2200],
        ],
        "Stir-fried noodles with vegetables.",
      ),
      ...variants(
        "Maggi Noodles",
        [
          ["Chicken", 900],
          ["Beef", 1000],
          ["Seafood", 1100],
          ["Mixed", 1250],
        ],
        "Spicy stir-fried Maggi noodles.",
      ),
    ],
  },
  {
    name: "String Hoppers",
    items: variants(
      "String Hoppers",
      [
        ["Egg", 700, 1100],
        ["Chicken", 900, 1300],
        ["Beef", 1100, 1500],
        ["Seafood", 1200, 1700],
        ["Mixed", 1300, 1900],
      ],
      "String hoppers tossed with vegetables and spices.",
    ),
  },
  {
    name: "BBQ & Tandoori",
    items: [
      { name: "BBQ Chicken", price: 1600, fullPrice: 3000, baseLabel: "Half", isFeatured: true, description: "Chargrilled BBQ chicken." },
      { name: "BBQ Chicken Leg", price: 800, description: "Chargrilled BBQ chicken leg." },
      { name: "BBQ Chicken Chest", price: 900, description: "Chargrilled BBQ chicken breast." },
      { name: "Tandoori Chicken", price: 1650, fullPrice: 3100, baseLabel: "Half", description: "Chicken marinated in tandoori spices and roasted." },
      { name: "Tandoori Chicken Leg", price: 900, description: "Tandoori-roasted chicken leg." },
      { name: "Tandoori Chicken Chest", price: 1000, description: "Tandoori-roasted chicken breast." },
    ],
  },
  {
    name: "Curry & Gravy",
    items: [
      { name: "Chicken Rara", price: 1300, description: "Indian special." },
      { name: "Chicken Kolhapuri", price: 1100, description: "Indian special." },
      { name: "Chicken Lababdar", price: 1100, description: "Indian special." },
      { name: "Chicken Tikka Masala", price: 1200, description: "Indian special." },
      { name: "Beef Tikka Masala", price: 1350, description: "Indian special." },
      ...variants(
        "Kadai",
        [
          ["Chicken", 1000],
          ["Beef", 1200],
          ["Paneer", 1000],
          ["Mutton", 1500],
        ],
        "Cooked kadai-style with peppers, onion and spices.",
      ),
      ...variants(
        "Korma",
        [
          ["Chicken", 1000],
          ["Beef", 1200],
          ["Paneer", 1000],
          ["Mutton", 1550],
        ],
        "Mild, creamy korma curry.",
      ),
    ],
  },
  {
    name: "Parotta",
    items: [
      { name: "Plain Parotta", price: 60, isVeg: true },
      { name: "Ghee Parotta", price: 120, isVeg: true },
      { name: "Garlic Parotta", price: 120, isVeg: true },
      { name: "Sugar Parotta", price: 120, isVeg: true },
      { name: "Banana Parotta", price: 150, isVeg: true },
      { name: "Egg Roti", price: 150 },
    ],
  },
  {
    name: "Starters",
    items: [
      { name: "Sweet Corn Veg Soup", price: 350, isVeg: true },
      { name: "Chicken Sweet Corn Soup", price: 600 },
      { name: "Hot & Sour Chicken Soup", price: 500 },
      { name: "French Fries", price: 600, isVeg: true },
      { name: "Mini Kives", price: 90 },
      { name: "Chicken Drumsticks", price: 130 },
      { name: "Crispy Chicken", price: 800 },
    ],
  },
  {
    name: "Side Dishes",
    items: [
      { name: "Fried Chicken", price: 700 },
      { name: "Chicken Devilled", price: 1200 },
      { name: "Fish Devilled", price: 1200 },
      { name: "Beef Devilled", price: 1300 },
      { name: "Paneer Devilled", price: 1400, isVeg: true },
      { name: "Chicken 65 (200g)", price: 1000 },
      { name: "Seafood Devilled", price: 1400 },
    ],
  },
  {
    name: "Omelettes",
    items: [
      { name: "Normal Omelette", price: 130 },
      { name: "Bullseye", price: 130 },
      { name: "Chicken Omelette", price: 350 },
      { name: "Cheese Omelette", price: 450 },
    ],
  },
  {
    name: "Bread & Bites",
    items: [
      { name: "Chicken Submarine", price: 1000 },
      { name: "Crispy Chicken Submarine", price: 1100 },
      { name: "Beef Submarine", price: 1200 },
      { name: "Chicken Burger", price: 900 },
      { name: "Crispy Chicken Burger", price: 1000 },
      { name: "Beef Burger", price: 1100 },
      { name: "Egg Club Sandwich", price: 600 },
      { name: "Chicken Club Sandwich", price: 800 },
      { name: "Beef Club Sandwich", price: 1000 },
      { name: "Chicken Shawarma", price: 1000 },
      { name: "Crispy Chicken Shawarma", price: 1100 },
      { name: "Beef Shawarma", price: 1200 },
    ],
  },
  {
    name: "Desserts & Ice Cream",
    items: [
      { name: "Brownie", price: 250, isVeg: true },
      { name: "Brownie with Ice Cream", price: 450, isVeg: true },
      { name: "Fruit Salad with Ice Cream", price: 600, isVeg: true },
      { name: "Fruit Salad", price: 500, isVeg: true },
      { name: "Watalappam", price: 200, isVeg: true },
      { name: "Vanilla Ice Cream", price: 350, isVeg: true },
      { name: "Chocolate Ice Cream", price: 350, isVeg: true },
      { name: "Strawberry Ice Cream", price: 350, isVeg: true },
      { name: "Mixed Ice Cream", price: 450, isVeg: true },
      { name: "Fruit & Nut Ice Cream", price: 400, isVeg: true },
      { name: "Kids Ice Cream", price: 200, isVeg: true },
    ],
  },
  {
    name: "Fresh Juices",
    items: (
      [
        ["Lemon", 350],
        ["Orange", 500],
        ["Mango", 450],
        ["Papaya", 300],
        ["Avocado", 450],
        ["Apple", 500],
        ["Passion Fruit", 400],
        ["Watermelon", 350],
        ["Pineapple", 400],
        ["Pumpkin", 400],
      ] as const
    ).map(([fruit, price]) => ({ name: `${fruit} Juice`, price, isVeg: true })),
  },
  {
    name: "Shakes & Lassi",
    items: [
      ...(
        [
          ["Banana", 500],
          ["Mango", 700],
          ["Strawberry", 600],
          ["Avocado", 700],
          ["Almond", 750],
          ["Vanilla", 600],
          ["Chocolate", 600],
          ["Snickers", 800],
          ["Ice Milo", 600],
        ] as const
      ).map(([flavour, price]) => ({ name: `${flavour} Shake`, price, isVeg: true })),
      { name: "Sweet Lassi", price: 450, isVeg: true },
      { name: "Mango Lassi", price: 650, isVeg: true },
      { name: "Banana Lassi", price: 500, isVeg: true },
    ],
  },
  {
    name: "Mojitos & Specials",
    items: [
      { name: "Strawberry Mojito", price: 600, isVeg: true },
      { name: "Blackberry Mojito", price: 600, isVeg: true },
      { name: "Classic Mojito", price: 600, isVeg: true },
      { name: "Pomegranate Mojito", price: 600, isVeg: true },
      { name: "Lemon Margarita", price: 550, isVeg: true },
      { name: "Strawberry Margarita", price: 550, isVeg: true },
      { name: "Lime with Mint", price: 600, isVeg: true },
      { name: "Faluda", price: 450, isVeg: true },
      { name: "Mixed Fruit Special", price: 750, isVeg: true },
    ],
  },
  {
    name: "Hot Drinks",
    items: [
      { name: "Nescafe", price: 150, isVeg: true },
      { name: "Cardamom Tea", price: 150, isVeg: true },
      { name: "Plain Tea", price: 100, isVeg: true },
    ],
  },
];

/** Dishes shown as bestsellers on the home page. */
export const FEATURED = new Set([
  "Chicken Kottu",
  "Chicken Cheese Kottu",
  "Chicken Biriyani",
  "Mixed Shawal",
  "BBQ Chicken",
  "Chicken Nasi Goreng",
]);

/** Photos in public/dishes, keyed by dish slug. */
export const DISH_IMAGES: Record<string, string> = {
  "bbq-chicken": "/dishes/bbq-chicken.webp",
  "chicken-biriyani": "/dishes/chicken-biriyani.webp",
  "chicken-kottu": "/dishes/chicken-kottu.webp",
  "chicken-cheese-kottu": "/dishes/chicken-cheese-kottu.webp",
  "chicken-nasi-goreng": "/dishes/chicken-nasi-goreng.webp",
  "mixed-shawal": "/dishes/mixed-shawal.webp",
};

/** Same rules as slugify() in src/lib/utils.ts, so admin edits keep the same slugs. */
export function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
