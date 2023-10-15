import {
  timestamp,
  pgTable,
  varchar,
  integer,
  pgEnum,
  serial,
} from "drizzle-orm/pg-core";

export const typeEnum = pgEnum("type", ["image", "video"]);

export const users = pgTable("users", {
  id: serial("user_id").primaryKey().notNull(),
  username: varchar("username", { length: 30 }).notNull().unique(),
  firstName: varchar("firstName", { length: 50 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  avatar: varchar("avatar", { length: 255 }).notNull(),
  followers: integer("followers").default(0),
});

export const media = pgTable("media", {
  id: serial("media_id").primaryKey().notNull(),
  type: typeEnum("type").notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  width: integer("width"),
  height: integer("height"),
});

export const posts = pgTable("posts", {
  id: serial("post_id").primaryKey().notNull(),
  user: integer("user_id")
    .references(() => users.id)
    .notNull(),
  date: timestamp("date").defaultNow(),
  content: varchar("content", { length: 255 }).notNull(),
  likes: integer("likes").default(0),
  replies: integer("replies").default(0),
  replyId: integer("replyId"),
  media: integer("media_id").references(() => media.id),
});
