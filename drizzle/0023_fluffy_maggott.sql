DROP TABLE "shopping_cart";--> statement-breakpoint
ALTER TABLE "shopping_cart_items" DROP CONSTRAINT "shopping_cart_items_cart_id_shopping_cart_id_fk";
--> statement-breakpoint
ALTER TABLE "shopping_cart_items" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shopping_cart_items" ADD CONSTRAINT "shopping_cart_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "shopping_cart_items" DROP COLUMN IF EXISTS "cart_id";