import express from "express";
import { APP_CONFIG } from "./config.js";
import { postsRouter } from "./routes/postsRouter.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

const app = express();

app.use(express.json());

// Simple health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/posts", postsRouter);

// 404 fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: "NotFound",
    message: "Route not found"
  });
});

// Error handler
app.use(errorMiddleware);

app.listen(APP_CONFIG.port, () => {
  console.log(`Server is running on http://localhost:${APP_CONFIG.port}`);
});
