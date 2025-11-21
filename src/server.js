import express from "express";
import { requestLogger } from "./middleware/checkAuth.js";
import authRoutes from "./routes/auth.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Middleware
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded body
app.use(requestLogger); // Request logging

// Routes
app.use("/api/auth", authRoutes);

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
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});


// chạy server:
app.listen(8080, () => {
    console.log("Server running on http://localhost:8080");
});

export default app;

