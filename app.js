import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import {errorHandler,notFound} from "./src/middleware/errorHandler.js"
import adminRouter from "./src/routes/adminRouter.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
connectDB();

import readerRouter from "./src/routes/readerRouter.js";
import bookRouter from "./src/routes/bookRouter.js";
import reviewRouter from "./src/routes/reviewRouter.js";
import transactionRouter from "./src/routes/transactionRouter.js";

app.use("/api/readers", readerRouter);
app.use("/api/books", bookRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/admin",adminRouter);
app.use(errorHandler)
app.use(notFound)


app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
