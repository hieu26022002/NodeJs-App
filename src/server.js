import cors from "cors";
import express from "express";
import { requestLogger } from "./middleware/checkAuth.js";
import authRoutes from "./routes/auth.js";
import productRoute from "./routes/product.js";
import storageRoutes from "./routes/storage.js";

const app = express();

app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger); // Request logging

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", storageRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api", productRoute);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "API Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  console.error("Error message:", err.message);
  // Nếu response đã được gửi, không gửi lại
  if (res.headersSent) {
    return next(err);
  }
  // Trả về lỗi chi tiết hơn để debug
  res.status(err.status || 500).json({
    error: err.message || "Something went wrong!",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


// chạy server:
app.listen(8082, () => {
  console.log("Server running on http://localhost:8082");
});

export default app;
