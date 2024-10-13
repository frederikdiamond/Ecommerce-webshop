import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  pgTable,
  uniqueIndex,
  serial,
  timestamp,
  varchar,
  pgEnum,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 50 }),
    lastName: varchar("last_name", { length: 50 }),
    dateOfBirth: date("date_of_birth"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    lastLogin: timestamp("last_login"),
    isActive: boolean("is_active").default(true),
    role: varchar("role", { length: 20 }).default("user"),
  },
  (table) => {
    return {
      usernameIdx: uniqueIndex("username_idx").on(table.username),
      emailIdx: uniqueIndex("email_idx").on(table.email),
    };
  },
);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  guestEmail: varchar("guest_email", { length: 255 }),
  isGuestOrder: boolean("is_guest_order").notNull().default(false),
  status: orderStatusEnum("status").default("pending").notNull(),
  totalAmount: integer("total_amount").notNull(), // Stored in cents
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }),
  specifications: jsonb("specifications").notNull().default([]),
  price: integer("price").notNull(), // Stored in cents
  basePrice: integer("base_price").notNull(), // No configurations. Stored in cents.
  stock: integer("stock").notNull().default(0),
  category: varchar("category", { length: 100 }),
  sku: varchar("sku", { length: 50 }).unique(),
  images: jsonb("images").notNull().default([]),
  isCustomizable: boolean("is_customizable").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  totalSold: integer("total_sold").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productConfigurations = pgTable(
  "product_configurations",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    category: varchar("category", { length: 255 }).notNull(), // E.g., "RAM", "Storage"
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      productCategoryIdx: uniqueIndex("product_category_idx").on(
        table.productId,
        table.category,
      ),
    };
  },
);

export const productOptions = pgTable(
  "product_options",
  {
    id: serial("id").primaryKey(),
    configurationId: integer("configuration_id")
      .notNull()
      .references(() => productConfigurations.id),
    optionLabel: varchar("option_label", { length: 255 }).notNull(), // E.g., "16GB", "1TB"
    priceModifier: integer("price_modifier").notNull(), // Price adjustment for this option in cents
    isDefault: boolean("is_default").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      configOptionIdx: uniqueIndex("config_option_idx").on(
        table.configurationId,
        table.optionLabel,
      ),
    };
  },
);

export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 255 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const wishlistItems = pgTable("wishlist_items", {
  id: serial("id").primaryKey(),
  wishlistId: integer("wishlist_id")
    .notNull()
    .references(() => wishlists.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const shoppingCartItems = pgTable("shopping_cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  price: integer("price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const shoppingCartItemConfigurations = pgTable(
  "shopping_cart_item_configurations",
  {
    id: serial("id").primaryKey(),
    cartItemId: integer("cart_item_id")
      .notNull()
      .references(() => shoppingCartItems.id), // Reference to shopping cart item
    optionId: integer("option_id")
      .notNull()
      .references(() => productOptions.id), // Reference to the selected option
  },
);

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: integer("price_at_purchase").notNull(), // Stored in cents
  selectedConfigurations: jsonb("selected_configurations").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  wishlists: many(wishlists),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const wishlistsRelations = relations(wishlists, ({ one, many }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  wishlistItems: many(wishlistItems),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  wishlist: one(wishlists, {
    fields: [wishlistItems.wishlistId],
    references: [wishlists.id],
  }),
  product: one(products, {
    fields: [wishlistItems.productId],
    references: [products.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  wishlistItems: many(wishlistItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
