import { 
  timestamp,
  boolean,
  varchar,
  pgTable,
  integer,
  text,
  decimal
} from "drizzle-orm/pg-core";

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

export const addressesTable = pgTable('addresses', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity().unique().notNull(),
  user_id: integer('user_id').references(() => usersTable.id, {onUpdate: "cascade", onDelete: "cascade"}).notNull(),
  address_line1: varchar('address_line1', {length: 255}).notNull(),
  address_line2: varchar('address_line2'),
  city: varchar('city', {length: 100}).notNull(),
  state: varchar('state', {length: 100}).notNull(),
  postal_code: varchar('postal_code', {length: 20}).notNull(),
  country: varchar('country', {length: 100}).notNull().default('Cuba'),
  is_default: boolean().default(false),
  created_at: timestamp('created_at').defaultNow(),
})

export type AddressesInsert = typeof addressesTable.$inferInsert;
export type AddressesSelect = typeof addressesTable.$inferSelect;

export const categoriesTable = pgTable('categories', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity().unique().notNull(),
  name: varchar('name', {length: 100}).unique().notNull(),
  description: text('description'),
  image_path: varchar('image_path', {length: 255}),
  parent_category_id: integer('parent_category_id').references(() => categoriesTable.id),
  created_at: timestamp('created_at').defaultNow(),
})

export type CategoriesInsert = typeof categoriesTable.$inferInsert;
export type CategoriesSelect = typeof categoriesTable.$inferSelect;

export const productsTable = pgTable('products', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity().unique().notNull(),
  name: varchar('name', {length: 255}).notNull(),
  description: text(),
  price: decimal('price').notNull(),
  compare_price: decimal('compare_price').notNull(),
  cost: decimal('cost').notNull(),
  sku: varchar('sku', {length: 100}).unique().notNull(),
  barcode: varchar('barcode', {length: 100}),
  weight: decimal('weight'),
  stock_quantity: integer('stock_quantity').default(0),
  is_active: boolean('is_active').default(true),
  category_id: integer('category_id').notNull().references(() => categoriesTable.id),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

export type ProductInsert = typeof productsTable.$inferInsert;
export type ProductSelect = typeof productsTable.$inferSelect;

export const productImagesTable = pgTable('product_images', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity().unique().notNull(),
  product_id: integer('product_id').references(() => productsTable.id, {onDelete:"cascade", onUpdate: "cascade"}),
  image_path: varchar('image_url', {length: 255}).notNull(),
  alt_text: varchar('alt_text', {length:255}),
  display_order: integer('display_order').default(0),
  is_primary: boolean('is_primary').default(false),
  created_at: timestamp('created_at').defaultNow(),
})

export type ProductImageInsert = typeof productImagesTable.$inferInsert;
export type ProductImageSelect = typeof productImagesTable.$inferSelect;

export const shoppingCartsTable = pgTable('shopping_carts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity().unique().notNull(),
  user_id: integer('user_id').references(() => usersTable.id, {onDelete: "cascade", onUpdate: "cascade"}).notNull().unique(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

export type ShoppingCartInsert = typeof shoppingCartsTable.$inferInsert;
export type ShoppingCartSelect = typeof shoppingCartsTable.$inferSelect;

export const cartItemsTable = pgTable('cart_items', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity().unique().notNull(),
  cart_id: integer('cart_id').references(() => shoppingCartsTable.id, {onDelete:"cascade", onUpdate:"cascade"}).notNull(),
  product_id: integer('product_id').references(() => productsTable.id).notNull(),
  quantity: integer('quantity').notNull(),
  unit_price: decimal('unit_price', {mode:"number"}).notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

export type CartItemInsert = typeof cartItemsTable.$inferInsert;
export type CartItemSelect = typeof cartItemsTable.$inferSelect;

export const ordersTable = pgTable('orders', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity().unique().notNull(),
  order_number: varchar('order_number', {length: 50}).unique().notNull(),
  user_id: integer('user_id').references(() => usersTable.id).notNull(),
  status: varchar('status', {length: 50, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']}).notNull().default('pending'),
  total_amount: decimal('total_amount').notNull(),
  subtotal: decimal('subtotal').notNull(),
  tax_amount: decimal('tax_amount'),
  shipping_amount: decimal('shipping_amount').default(`0`),
  shipping_address_id: integer('shipping_address_id').references(() => addressesTable.id).notNull(),
  payment_status: varchar('payment_status', {length: 50, enum: ['pending', 'paid', 'failed', 'refunded']}).notNull().default('pending'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

export type OrderInsert = typeof ordersTable.$inferInsert;
export type OrderSelect = typeof ordersTable.$inferSelect;

export const orderItemsTable = pgTable('order_items', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity().unique().notNull(),
  order_id: integer('order_id').references(() => ordersTable.id, {onDelete:"cascade", onUpdate:"cascade"}).notNull(),
  product_id: integer('product_id').references(() => productsTable.id).notNull(),
  product_name: varchar('product_name', {length: 255}).notNull(),
  product_price: decimal('product_price').notNull(),
  quantity: integer('quantity').notNull(),
  total_price: decimal('total_price').notNull(),
  created_at: timestamp('created_at').defaultNow(),
})

export type OrderItemInsert = typeof orderItemsTable.$inferInsert;
export type OrderItemSelect = typeof orderItemsTable.$inferSelect;

export const paymentsTable = pgTable('payments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity().unique().notNull(),
  order_id: integer('order_id').references(() => ordersTable.id).unique().notNull(),
  payment_method: varchar('payment_method', {length: 50, enum: ['credit_card', 'debit_card', 'paypal', 'mercado_pago']}).notNull(),
  payment_gateway_id: varchar('payment_gateway_id', {length: 255}),
  amount: decimal('amount').notNull(),
  currency: varchar('currency', {length: 3}).default('CUP'),
  status: varchar('status', {length: 50, enum: ['pending', 'processing', 'completed', 'failed', 'refunded']}).notNull(),
  // respuesta de la pasarela de pago
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

export type PaymentInsert = typeof paymentsTable.$inferInsert;
export type PaymentSelect = typeof paymentsTable.$inferSelect;

/* 

*/