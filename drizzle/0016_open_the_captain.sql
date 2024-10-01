CREATE TABLE IF NOT EXISTS "product_configurations" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"category" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"configuration_id" integer NOT NULL,
	"option_label" varchar(255) NOT NULL,
	"price_modifier" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "slug" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "selected_configurations" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "base_price" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_configurations" ADD CONSTRAINT "product_configurations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_options" ADD CONSTRAINT "product_options_configuration_id_product_configurations_id_fk" FOREIGN KEY ("configuration_id") REFERENCES "public"."product_configurations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_slug_unique" UNIQUE("slug");