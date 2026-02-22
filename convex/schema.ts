import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - with password authentication
  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.union(
      v.literal("user"),
      v.literal("owner"),
      v.literal("admin")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  // Motels table
  motels: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    location: v.string(),
    state: v.string(),
    city: v.string(),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    tripadvisor: v.optional(v.string()),
    email: v.optional(v.string()),
    
    // Coordinates for map
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    
    // Images
    images: v.optional(v.array(v.string())),
    mainImage: v.optional(v.string()),
    
    // Features
    features: v.optional(v.array(v.string())),
    
    // Hours and periods
    hours: v.optional(v.string()),
    periods: v.optional(v.array(v.string())),
    
    // Stats
    viewCount: v.optional(v.number()),
    contactCount: v.optional(v.number()),
    
    // Subscription
    isPremium: v.boolean(),
    premiumExpiresAt: v.optional(v.number()),
    
    // Status
    status: v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("paused"),
      v.literal("rejected")
    ),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    approvedAt: v.optional(v.number()),
    approvedBy: v.optional(v.id("users")),
  })
    .index("by_owner", ["ownerId"])
    .index("by_status", ["status"])
    .index("by_state", ["state"])
    .index("by_premium", ["isPremium"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["status", "state", "isPremium"],
    }),

  // Contacts/Leads table
  contacts: defineTable({
    motelId: v.id("motels"),
    type: v.union(
      v.literal("phone"),
      v.literal("whatsapp"),
      v.literal("email"),
      v.literal("website")
    ),
    userId: v.optional(v.id("users")),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_motel", ["motelId"]),

  // Subscriptions table
  subscriptions: defineTable({
    userId: v.id("users"),
    motelId: v.id("motels"),
    stripeSubscriptionId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("expired"),
      v.literal("past_due")
    ),
    plan: v.union(
      v.literal("free"),
      v.literal("premium")
    ),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_motel", ["motelId"]),
});
