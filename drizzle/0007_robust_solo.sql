ALTER TABLE "products" DROP CONSTRAINT "products_slug_unique";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "slug" DROP NOT NULL;