ALTER TABLE "product" DROP CONSTRAINT "product_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;