import { AppError } from "./errorHandler.js";

/**
 * Middleware to check if user is admin
 * Must be used after protect middleware
 */
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }

  if (req.user.role !== "admin") {
    return next(
      new AppError("Access denied. Admin privileges required.", 403)
    );
  }

  next();
};

/**
 * Middleware to check if user is moderator or admin
 * Must be used after protect middleware
 */
export const isModerator = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }

  if (req.user.role !== "admin" && req.user.role !== "moderator") {
    return next(
      new AppError("Access denied. Moderator privileges required.", 403)
    );
  }

  next();
};

/**
 * Middleware to check if user account is approved
 * Must be used after protect middleware
 */
export const isApproved = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }

  // Admins and moderators are always approved
  if (req.user.role === "admin" || req.user.role === "moderator") {
    return next();
  }

  if (!req.user.isApproved) {
    return next(
      new AppError(
        "Your account is pending approval. Please wait for admin verification.",
        403
      )
    );
  }

  next();
};

/**
 * Middleware to check if user account is active
 * Must be used after protect middleware
 */
export const isActive = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }

  if (!req.user.isActive) {
    return next(
      new AppError("Your account has been deactivated. Contact support.", 403)
    );
  }

  next();
};

/**
 * Combined middleware: Check authentication, approval, and active status
 */
export const requireApproved = [isApproved, isActive];