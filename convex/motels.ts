import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import crypto from "crypto";

// Password hashing function
const hashPassword = (password: string) => 
  crypto.createHash('sha256').update(password + 'bdsmbrazil_salt').digest('hex');

// Get all motels
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("motels").collect();
  },
});

// Get motels by status
export const getByStatus = query({
  args: {
    status: v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("paused"),
      v.literal("rejected")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("motels")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Get motels by owner
export const getByOwner = query({
  args: {
    ownerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("motels")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .collect();
  },
});

// Get single motel
export const getById = query({
  args: {
    id: v.id("motels"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create motel
export const create = mutation({
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
    tripadvisor: v.optional(v.string()),
    email: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    mainImage: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    hours: v.optional(v.string()),
    periods: v.optional(v.array(v.string())),
    isPremium: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const motelId = await ctx.db.insert("motels", {
      ...args,
      status: "pending",
      viewCount: 0,
      contactCount: 0,
      createdAt: now,
      updatedAt: now,
    });
    return motelId;
  },
});

// Update motel
export const update = mutation({
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
    tripadvisor: v.optional(v.string()),
    email: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    mainImage: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    hours: v.optional(v.string()),
    periods: v.optional(v.array(v.string())),
    isPremium: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Update motel status (admin)
export const updateStatus = mutation({
  args: {
    id: v.id("motels"),
    status: v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("paused"),
      v.literal("rejected")
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: now,
      ...(args.status === "active" ? { approvedAt: now } : {}),
    });
  },
});

// Approve motel (admin)
export const approve = mutation({
  args: {
    id: v.id("motels"),
    approvedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.id, {
      status: "active",
      approvedAt: now,
      approvedBy: args.approvedBy,
      updatedAt: now,
    });
  },
});

// Reject motel (admin)
export const reject = mutation({
  args: {
    id: v.id("motels"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "rejected",
      updatedAt: Date.now(),
    });
  },
});

// Delete motel
export const remove = mutation({
  args: {
    id: v.id("motels"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Increment view count
export const incrementViews = mutation({
  args: {
    id: v.id("motels"),
  },
  handler: async (ctx, args) => {
    const motel = await ctx.db.get(args.id);
    if (motel) {
      await ctx.db.patch(args.id, {
        viewCount: (motel.viewCount || 0) + 1,
      });
    }
  },
});

// Increment contact count
export const incrementContacts = mutation({
  args: {
    id: v.id("motels"),
  },
  handler: async (ctx, args) => {
    const motel = await ctx.db.get(args.id);
    if (motel) {
      await ctx.db.patch(args.id, {
        contactCount: (motel.contactCount || 0) + 1,
      });
    }
  },
});

// Seed initial super admin (run once)
export const seedSuperAdmin = mutation({
  handler: async (ctx) => {
    // Check if admin already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "glwebagency2@gmail.com"))
      .first();
    
    if (existing) {
      return { message: "Super admin already exists", userId: existing._id };
    }
    
    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      email: "glwebagency2@gmail.com",
      passwordHash: hashPassword("admin12345"),
      name: "Super Admin",
      role: "admin",
      createdAt: now,
      updatedAt: now,
    });
    
    return { message: "Super admin created", userId };
  },
});
