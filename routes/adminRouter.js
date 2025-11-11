import express from "express";
import { protect } from "../middleware/auth.js";
import { isAdmin, isModerator } from "../middleware/adminAuth.js";
import {
  // Dashboard
  getDashboardStats,
  
  // User Management
  getAllUsers,
  getPendingUsers,
  approveUser,
  toggleUserStatus,
  deleteUser,
  
  // Book Management
  getAllBooksAdmin,
  getPendingBooks,
  approveBook,
  rejectBook,
  toggleFeaturedBook,
  deleteBookAdmin,
  
  // Transaction Management
  getAllTransactions,
  
  // Review Management
  getAllReviews,
  deleteReviewAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);

// ==================== DASHBOARD ====================
router.get("/dashboard/stats", isAdmin, getDashboardStats);

// ==================== USER MANAGEMENT ====================
router.get("/users", isAdmin, getAllUsers);
router.get("/users/pending", isModerator, getPendingUsers);
router.put("/users/:id/approve", isModerator, approveUser);
router.put("/users/:id/toggle-status", isAdmin, toggleUserStatus);
router.delete("/users/:id", isAdmin, deleteUser);

// ==================== BOOK MANAGEMENT ====================
router.get("/books", isModerator, getAllBooksAdmin);
router.get("/books/pending", isModerator, getPendingBooks);
router.put("/books/:id/approve", isModerator, approveBook);
router.put("/books/:id/reject", isModerator, rejectBook);
router.put("/books/:id/toggle-featured", isAdmin, toggleFeaturedBook);
router.delete("/books/:id", isAdmin, deleteBookAdmin);

// ==================== TRANSACTION MANAGEMENT ====================
router.get("/transactions", isAdmin, getAllTransactions);

// ==================== REVIEW MANAGEMENT ====================
router.get("/reviews", isModerator, getAllReviews);
router.delete("/reviews/:id", isModerator, deleteReviewAdmin);

export default router;