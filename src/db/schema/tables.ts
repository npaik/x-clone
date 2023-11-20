import { timestamp, pgTable, text, primaryKey, integer, serial, pgEnum, AnyPgColumn } from "drizzle-orm/pg-core"
import type { AdapterAccount } from "@auth/core/adapters"

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
)

export const mediaType = pgEnum("media_type", ["image", "video"])

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  type: mediaType("type").notNull(),
  url: text("url").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  postId: integer("post_id").references(() => posts.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  replyId: integer("reply_id").references((): AnyPgColumn => posts.id), // Explicitly set the return type because of TypeScript limitations
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
