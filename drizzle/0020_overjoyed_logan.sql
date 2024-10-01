ALTER TABLE "products" RENAME COLUMN "image_url" TO "images";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "specifications" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "specifications" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "images" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "images" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "images" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "product_category_idx" ON "product_configurations" USING btree ("product_id","category");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "config_option_idx" ON "product_options" USING btree ("configuration_id","option_label");