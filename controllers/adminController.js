import Reader from "../models/Reader.js";
import Book from "../models/Book.js";
import Transaction from "../models/Transaction.js";
import Review from "../models/Review.js";
import { AppError } from "../middleware/errorHandler.js";
import { paginationResponse } from "../utils/paginate.js";

// ==================== DASHBOARD STATISTICS ====================

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalBooks,
      totalTransactions,
      totalRevenue,
      pendingApprovals,
      activeUsers,
    ] = await Promise.all([
      Reader.countDocuments(),
      Book.countDocuments(),
      Transaction.countDocuments(),
      Transaction.aggregate([
        { $match: { status: "Completed" } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Reader.countDocuments({ isApproved: false, role: "user" }),
      Reader.countDocuments({ isActive: true }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalBooks,
        totalTransactions,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingApprovals,
        activeUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== USER MANAGEMENT ====================

// Get all users with filters
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, isApproved, isActive, search } = req.query;
    
    const filter = {};
    if (role) filter.role = role;
    if (isApproved !== undefined) filter.isApproved = isApproved === "true";
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await Reader.find(filter)
      .select("-password")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Reader.countDocuments(filter);
    const response = paginationResponse(users, parseInt(page), parseInt(limit), total);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get pending user approvals
export const getPendingUsers = async (req, res, next) => {
  try {
    const users = await Reader.find({
      isApproved: false,
      role: "user",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Approve user
export const approveUser = async (req, res, next) => {
  try {
    const user = await Reader.findById(req.params.id);
    
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (user.isApproved) {
      return next(new AppError("User is already approved", 400));
    }

    user.isApproved = true;
    user.approvedBy = req.user.id;
    user.approvedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "User approved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Deactivate/Activate user
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await Reader.findById(req.params.id);
    
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Prevent deactivating admins
    if (user.role === "admin") {
      return next(new AppError("Cannot deactivate admin users", 403));
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const user = await Reader.findById(req.params.id);
    
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Prevent deleting admins
    if (user.role === "admin") {
      return next(new AppError("Cannot delete admin users", 403));
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==================== BOOK MANAGEMENT ====================

// Get all books (including unapproved)
export const getAllBooksAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, approvalStatus, search } = req.query;
    
    const filter = {};
    if (approvalStatus) filter.approvalStatus = approvalStatus;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const books = await Book.find(filter)
      .populate("owner", "name email")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(filter);
    const response = paginationResponse(books, parseInt(page), parseInt(limit), total);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get pending book approvals
export const getPendingBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ approvalStatus: "pending" })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

// Approve book
export const approveBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return next(new AppError("Book not found", 404));
    }

    if (book.approvalStatus === "approved") {
      return next(new AppError("Book is already approved", 400));
    }

    book.isApproved = true;
    book.approvalStatus = "approved";
    book.approvedBy = req.user.id;
    book.approvedAt = new Date();
    await book.save();

    res.status(200).json({
      success: true,
      message: "Book approved successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// Reject book
export const rejectBook = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return next(new AppError("Book not found", 404));
    }

    book.isApproved = false;
    book.approvalStatus = "rejected";
    book.rejectionReason = reason || "Does not meet quality standards";
    await book.save();

    res.status(200).json({
      success: true,
      message: "Book rejected",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle featured status
export const toggleFeaturedBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return next(new AppError("Book not found", 404));
    }

    book.isFeatured = !book.isFeatured;
    await book.save();

    res.status(200).json({
      success: true,
      message: `Book ${book.isFeatured ? "featured" : "unfeatured"} successfully`,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// Delete book
export const deleteBookAdmin = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return next(new AppError("Book not found", 404));
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==================== TRANSACTION MANAGEMENT ====================

export const getAllTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const transactions = await Transaction.find(filter)
      .populate("book", "title author price")
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Transaction.countDocuments(filter);
    const response = paginationResponse(transactions, parseInt(page), parseInt(limit), total);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ==================== REVIEW MANAGEMENT ====================

export const getAllReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const reviews = await Review.find()
      .populate("book", "title")
      .populate("reviewer", "name email")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments();
    const response = paginationResponse(reviews, parseInt(page), parseInt(limit), total);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteReviewAdmin = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return next(new AppError("Review not found", 404));
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};