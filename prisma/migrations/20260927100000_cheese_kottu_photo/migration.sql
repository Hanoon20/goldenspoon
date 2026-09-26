-- Photo for Chicken Cheese Kottu. Only fills it when no image is set yet, so a photo set in admin is kept.
UPDATE "MenuItem" SET "image" = '/dishes/chicken-cheese-kottu.webp' WHERE "slug" = 'chicken-cheese-kottu' AND "image" = '';
