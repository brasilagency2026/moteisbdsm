import { Auth } from "convex/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import crypto from "crypto";

// Simple password hashing (in production, use bcrypt or similar)
function hashPassword(password: string): string {
  // Simple hash for demo - in production use bcrypt
  return crypto.createHash('sha256').update(password + 'bdsmbrazil_salt').digest('hex');
}

// Verify password
function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Get current user from session
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();
    
    return user;
  },
});

// Login mutation
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    
    if (!verifyPassword(args.password, user.passwordHash)) {
      throw new Error("Mot de passe incorrect");
    }
    
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
});

// Create user (for registration or seeding)
export const createUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
    role: v.union(
      v.literal("user"),
      v.literal("owner"),
      v.literal("admin")
    ),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }
    
    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      email: args.email,
      passwordHash: hashPassword(args.password),
      name: args.name,
      role: args.role,
      createdAt: now,
      updatedAt: now,
    });
    
    return userId;
  },
});

// Get all users (admin only)
export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Update user role (admin only)
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(
      v.literal("user"),
      v.literal("owner"),
      v.literal("admin")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      role: args.role,
      updatedAt: Date.now(),
    });
  },
});

// Delete user (admin only)
export const deleteUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.userId);
  },
});
