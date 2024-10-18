CREATE TABLE IF NOT EXISTS "wishlist_item_configurations" (
	"id" serial PRIMARY KEY NOT NULL,
	"wishlist_item_id" integer NOT NULL,
	"option_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlist_item_configurations" ADD CONSTRAINT "wishlist_item_configurations_wishlist_item_id_wishlist_items_id_fk" FOREIGN KEY ("wishlist_item_id") REFERENCES "public"."wishlist_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlist_item_configurations" ADD CONSTRAINT "wishlist_item_configurations_option_id_product_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."product_options"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
