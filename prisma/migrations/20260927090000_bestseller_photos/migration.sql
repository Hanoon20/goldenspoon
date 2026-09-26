-- Photos for the bestsellers. Only fills dishes that have no image yet, so photos set in admin are kept.
UPDATE "MenuItem" SET "image" = '/dishes/bbq-chicken.webp' WHERE "slug" = 'bbq-chicken' AND "image" = '';
UPDATE "MenuItem" SET "image" = '/dishes/chicken-biriyani.webp' WHERE "slug" = 'chicken-biriyani' AND "image" = '';
UPDATE "MenuItem" SET "image" = '/dishes/chicken-kottu.webp' WHERE "slug" = 'chicken-kottu' AND "image" = '';
UPDATE "MenuItem" SET "image" = '/dishes/chicken-nasi-goreng.webp' WHERE "slug" = 'chicken-nasi-goreng' AND "image" = '';
UPDATE "MenuItem" SET "image" = '/dishes/mixed-shawal.webp' WHERE "slug" = 'mixed-shawal' AND "image" = '';
