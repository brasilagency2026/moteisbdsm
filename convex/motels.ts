import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// =============================================
// USER MUTATIONS
// =============================================

// Create or update user from Clerk webhook
export const createOrUpdateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.optional(v.union(v.literal("user"), v.literal("owner"), v.literal("admin"))),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const now = Date.now();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        image: args.image,
        role: args.role || existingUser.role,
        updatedAt: now,
      });
      return existingUser._id;
    }

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      image: args.image,
      role: args.role || "user",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Update user role
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("owner"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      role: args.role,
      updatedAt: Date.now(),
    });
  },
});

// =============================================
// MOTEL MUTATIONS & QUERIES
// =============================================

// Create a new motel
export const createMotel = mutation({
  args: {
    ownerId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    location: v.string(),
    state: v.string(),
    city: v.string(),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    website: v.optional(v.string()),
    email: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    mainImage: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    themes: v.array(v.string()),
    features: v.optional(v.array(v.string())),
    priceFrom: v.optional(v.number()),
    priceTo: v.optional(v.number()),
    isPremium: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("motels", {
      ...args,
      status: "pending",
      rating: 0,
      reviewCount: 0,
      viewCount: 0,
      contactCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get all motels (with filters)
export const getMotels = query({
  args: {
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("paused"),
      v.literal("rejected")
    )),
    state: v.optional(v.string()),
    isPremium: v.optional(v.boolean()),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("motels");

    if (args.status) {
      query = query.withIndex("by_status", (q) => q.eq("status", args.status!));
    }

    let motels = await query.collect();

    // Apply filters
    if (args.state) {
      motels = motels.filter((m) => m.state === args.state);
    }

    if (args.isPremium !== undefined) {
      motels = motels.filter((m) => m.isPremium === args.isPremium);
    }

    if (args.searchQuery) {
      const searchLower = args.searchQuery.toLowerCase();
      motels = motels.filter(
        (m) =>
          m.name.toLowerCase().includes(searchLower) ||
          m.location.toLowerCase().includes(searchLower) ||
          m.themes.some((t) => t.toLowerCase().includes(searchLower))
      );
    }

    return motels;
  },
});

// Get motel by ID
export const getMotelById = query({
  args: { id: v.id("motels") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get motels by owner
export const getMotelsByOwner = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("motels")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .collect();
  },
});

// Update motel
export const updateMotel = mutation({
  args: {
    id: v.id("motels"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    state: v.optional(v.string()),
    city: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    website: v.optional(v.string()),
    email: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    mainImage: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    themes: v.optional(v.array(v.string())),
    features: v.optional(v.array(v.string())),
    priceFrom: v.optional(v.number()),
    priceTo: v.optional(v.number()),
    isPremium: v.optional(v.boolean()),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("paused"),
      v.literal("rejected")
    )),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete motel
export const deleteMotel = mutation({
  args: { id: v.id("motels") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Approve motel (admin only)
export const approveMotel = mutation({
  args: {
    id: v.id("motels"),
    approvedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "active",
      approvedAt: Date.now(),
      approvedBy: args.approvedBy,
      updatedAt: Date.now(),
    });
  },
});

// Reject motel (admin only)
export const rejectMotel = mutation({
  args: { id: v.id("motels") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "rejected",
      updatedAt: Date.now(),
    });
  },
});

// Pause/Resume motel
export const toggleMotelStatus = mutation({
  args: {
    id: v.id("motels"),
    status: v.union(v.literal("active"), v.literal("paused")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Increment view count
export const incrementViewCount = mutation({
  args: { id: v.id("motels") },
  handler: async (ctx, args) => {
    const motel = await ctx.db.get(args.id);
    if (motel) {
      await ctx.db.patch(args.id, {
        viewCount: (motel.viewCount || 0) + 1,
      });
    }
  },
});

// =============================================
// REVIEW MUTATIONS & QUERIES
// =============================================

// Create review
export const createReview = mutation({
  args: {
    motelId: v.id("motels"),
    userId: v.id("users"),
    rating: v.number(),
    title: v.optional(v.string()),
    comment: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("reviews", {
      ...args,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get reviews by motel
export const getReviewsByMotel = query({
  args: { motelId: v.id("motels") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_motel", (q) => q.eq("motelId", args.motelId))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();
  },
});

// =============================================
// CONTACT TRACKING
// =============================================

// Track contact
export const trackContact = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Increment contact count
    const motel = await ctx.db.get(args.motelId);
    if (motel) {
      await ctx.db.patch(args.motelId, {
        contactCount: (motel.contactCount || 0) + 1,
      });
    }

    return await ctx.db.insert("contacts", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// =============================================
// STATS QUERIES
// =============================================

// Get dashboard stats for owner
export const getOwnerStats = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const motels = await ctx.db
      .query("motels")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .collect();

    const totalViews = motels.reduce((sum, m) => sum + (m.viewCount || 0), 0);
    const totalContacts = motels.reduce((sum, m) => sum + (m.contactCount || 0), 0);

    return {
      motelCount: motels.length,
      totalViews,
      totalContacts,
      activeMotels: motels.filter((m) => m.status === "active").length,
      pendingMotels: motels.filter((m) => m.status === "pending").length,
    };
  },
});

// Get admin stats
export const getAdminStats = query({
  handler: async (ctx) => {
    const motels = await ctx.db.query("motels").collect();
    const users = await ctx.db.query("users").collect();

    return {
      totalMotels: motels.length,
      activeMotels: motels.filter((m) => m.status === "active").length,
      pendingMotels: motels.filter((m) => m.status === "pending").length,
      premiumMotels: motels.filter((m) => m.isPremium).length,
      totalUsers: users.length,
      owners: users.filter((u) => u.role === "owner").length,
    };
  },
});
