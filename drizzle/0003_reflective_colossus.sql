ALTER TABLE "orders" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "guest_email" varchar(255);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "is_guest_order" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_name_unique" UNIQUE("name");