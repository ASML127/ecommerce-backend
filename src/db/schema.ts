import { 
  timestamp,
  boolean,
  varchar,
  pgTable,
  integer
} from "drizzle-orm/pg-core";

// const timestamps = {
//   created_at: timestamp('created_at').defaultNow(),
//   updated_at: timestamp('updated_at'),
//   deleted_at: timestamp('deleted_at'),
// }

export const usersTable = pgTable('users', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity().unique().notNull(),
    email: varchar('email', {length: 100}).unique().notNull(),
    password: varchar('password', {length: 255}).notNull(),
    first_name: varchar('first_name', {length: 100}).notNull(),
    last_name: varchar('last_name', {length: 100}).notNull(),
    phone: varchar('phone', {length: 20}),
    created_at: timestamp('created_at').defaultNow(),
    is_active: boolean('is_active').default(true)
})

export type UserInsert = typeof usersTable.$inferInsert;
export type UserSelect = typeof usersTable.$inferSelect;
