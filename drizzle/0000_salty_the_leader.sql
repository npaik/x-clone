DO $$ BEGIN
 CREATE TYPE "type" AS ENUM('image', 'video');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media" (
	"media_id" serial PRIMARY KEY NOT NULL,
	"type" "type" NOT NULL,
	"url" varchar(255) NOT NULL,
	"width" integer,
	"height" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"post_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date" timestamp DEFAULT now(),
	"content" varchar(255) NOT NULL,
	"likes" integer DEFAULT 0,
	"replies" integer DEFAULT 0,
	"replyId" integer,
	"media_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"username" varchar(30) NOT NULL,
	"firstName" varchar(50) NOT NULL,
	"lastName" varchar(100) NOT NULL,
	"avatar" varchar(255) NOT NULL,
	"followers" integer DEFAULT 0,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_media_id_media_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "media"("media_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
