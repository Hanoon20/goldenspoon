# Golden Spoon

A modern restaurant website with a customer storefront and an admin panel. Customers browse the menu, add dishes to a cart, and send the order to the restaurant on **WhatsApp**. Every order is also saved in the database, so staff can track it in the admin panel.

Built for Sri Lanka: prices in Rs. (LKR), phone numbers like `077 123 4567` are converted to `94771234567` for WhatsApp, and times are shown in Asia/Colombo.

## Features

**Customer site**
- Home page: hero, how-to-order steps, bestsellers, categories, about and contact
- Menu: category tabs, search, veg-only filter, photos, clear prices, sold-out badges
- Cart kept in the browser: delivery or takeaway, name, phone, address and note
- "Order on WhatsApp": the order is saved, then WhatsApp opens with a ready-made message (order number, items, total)
- Prices are always recalculated on the server from the database

**Admin panel (`/admin`)**
- Login with email and password (bcrypt-hashed, signed httpOnly session cookie)
- Dashboard: today's orders and revenue, active orders, recent orders, top dishes
- Orders: filter by status, view details, update status, reply to the customer on WhatsApp or call them
- Menu: add, edit and delete dishes, photo URL with preview, bestseller flag, one-click sold-out toggle
- Categories: add, rename, reorder and delete
- Settings: restaurant name, WhatsApp number, address, map link, hours, delivery fee, minimum order, open/closed switch, change password

## Tech stack

Next.js 16 (App Router, Server Actions) · TypeScript · Tailwind CSS 4 · PostgreSQL + Prisma · Zustand (cart) · Zod (validation) · jose + bcryptjs (auth) · deploys on Netlify or Vercel

## Project structure

```
prisma/
  schema.prisma          Database models (Admin, Category, MenuItem, Order, OrderItem, Setting)
  seed.ts                First admin account + sample Sri Lankan menu
  migrations/
src/
  app/
    (shop)/              Customer site: home, /menu, /cart (+ placeOrder server action)
    admin/login/         Admin login
    admin/(panel)/       Dashboard, orders, menu, categories, settings (+ actions.ts)
  components/
    shop/                Navbar, Footer, DishCard, MenuBrowser, AddToCartButton…
    admin/               Sidebar, forms, status badge
  lib/                   db, auth/session, settings, utils
  store/cart.ts          Cart state (saved in localStorage)
  proxy.ts               Redirects to /admin/login when not signed in
```

## Run locally

Requirements: Node.js 20+ and PostgreSQL.

```bash
npm install
cp .env.example .env          # then fill in DATABASE_URL, DIRECT_URL, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npx prisma migrate dev        # create tables
npm run db:seed               # create admin + sample menu
npm run dev                   # http://localhost:3000   (admin: http://localhost:3000/admin)
```

Generate `AUTH_SECRET` with `openssl rand -base64 32`.

## Deploy (Netlify + Neon, both have free tiers)

1. **Database:** create a project at [neon.tech](https://neon.tech) in the **AWS US East (Ohio)** region, close to Netlify's default server location, so pages load fast. Copy the **pooled** connection string (for `DATABASE_URL`) and the **direct** one (for `DIRECT_URL`).
2. **Netlify:** log in at [netlify.com](https://app.netlify.com) with GitHub → **Add new site → Import an existing project** → pick this repo. The build settings come from `netlify.toml`, so leave them as they are.
3. **Environment variables:** in Site configuration → Environment variables, add every variable from `.env.example`. Then run **Deploys → Trigger deploy**. Each deploy runs the database migrations automatically.
4. **First admin:** nothing to run. Open `/admin/login` and sign in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set. The first matching login creates the admin account. (Optional: to load the sample menu, run `npm run db:seed` from your computer with the production `DATABASE_URL` and `DIRECT_URL`.)
5. Log in at `https://<your-site>.netlify.app/admin`. Under **Settings**, set the real WhatsApp number, address and hours. Under **Menu**, replace the sample dishes with the real menu and photos.
6. (Optional) Add your domain, e.g. `goldenspoon.lk`, in Domain management and add the DNS records Netlify shows.

### Vercel instead

This also works on [Vercel](https://vercel.com) with no extra config: import the repo and add the same environment variables. The `vercel-build` script runs the migrations, and the first admin is created on first login as above. On Vercel, you can put both the database and the functions in Singapore (`sin1`).

## Dish photos

Paste any public image URL in the dish form. For uploads, a free [Cloudinary](https://cloudinary.com) account works well: upload the photo, then copy its URL.
