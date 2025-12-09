import { jsonPlaceholderClient } from "../services/jsonPlaceholderClient.js";

export function errorMiddleware(err, req, res, next) {
  console.error(`[ERROR] ${err.name}: ${err.message}`, err.details || err);

  // External API errors
  if (err instanceof jsonPlaceholderClient.ExternalApiError) {
    return res.status(502).json({
      error: "Upstream API error",
      message: err.message,
      details: err.details || null
    });
  }

  // Custom HTTP errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.name || "Error",
      message: err.message
    });
  }

  // Fallback - unknown error
  return res.status(500).json({
    error: "InternalServerError",
    message: "Something went wrong. Please try again later."
  });
}
