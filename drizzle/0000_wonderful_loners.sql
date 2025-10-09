CREATE TABLE "users" (
	"id" integer GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"phone" varchar(20),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
