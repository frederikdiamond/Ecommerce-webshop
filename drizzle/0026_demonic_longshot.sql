ALTER TABLE "shopping_cart_item_configurations" RENAME COLUMN "configuration_id" TO "option_id";--> statement-breakpoint
ALTER TABLE "shopping_cart_item_configurations" DROP CONSTRAINT "shopping_cart_item_configurations_configuration_id_product_options_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shopping_cart_item_configurations" ADD CONSTRAINT "shopping_cart_item_configurations_option_id_product_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."product_options"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
