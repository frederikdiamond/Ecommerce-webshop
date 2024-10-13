CREATE TABLE IF NOT EXISTS "shopping_cart_item_configurations" (
	"id" serial PRIMARY KEY NOT NULL,
	"cart_item_id" integer NOT NULL,
	"configuration_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shopping_cart_item_configurations" ADD CONSTRAINT "shopping_cart_item_configurations_cart_item_id_shopping_cart_items_id_fk" FOREIGN KEY ("cart_item_id") REFERENCES "public"."shopping_cart_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shopping_cart_item_configurations" ADD CONSTRAINT "shopping_cart_item_configurations_configuration_id_product_options_id_fk" FOREIGN KEY ("configuration_id") REFERENCES "public"."product_options"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
