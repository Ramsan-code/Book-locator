import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createTransaction,
  getUserTransactions,
  getTransactionById,
  updateTransactionStatus,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", protect, createTransaction);
router.get("/", protect, getUserTransactions);
router.get("/:id", protect, getTransactionById);
router.put("/:id/status", protect, updateTransactionStatus);

export default router;
