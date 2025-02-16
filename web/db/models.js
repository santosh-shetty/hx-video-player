import { mysqlTable, int, varchar, text, datetime } from "drizzle-orm/mysql-core";

export const VideoSettings = mysqlTable("video_settings", {
  id: int("id").primaryKey().autoincrement(),
  playerName: varchar("playerName", { length: 255 }).notNull(),
  containerWidth: int("containerWidth").default(100),
  theme: varchar("theme", { length: 255 }).default("60px 0px 60px 0px"),
  margin: varchar("margin", { length: 255 }).default("0"),
  padding: varchar("padding", { length: 255 }).notNull(),
  alignment: varchar("alignment", { length: 255 }).notNull(),
  gap: varchar("gap", { length: 255 }).notNull(),
  columns: varchar("columns", { length: 255 }).notNull(),
  videoBlocks: text("videoBlocks").default(null),
  createdAt: datetime("createdAt").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: datetime("updatedAt")
    .notNull()
    .default("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
});
