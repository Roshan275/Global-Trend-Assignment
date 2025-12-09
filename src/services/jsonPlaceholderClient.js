import { APP_CONFIG } from "../config.js";
import { cacheService } from "./cacheService.js";

class ExternalApiError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ExternalApiError";
    this.details = details;
  }
}

async function fetchWithTimeout(url, options = {}, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    if (!response.ok) {
      throw new ExternalApiError(`API responded with status ${response.status}`, {
        status: response.status,
        url
      });
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new ExternalApiError("Request timed out", { url, timeoutMs });
    }
    if (error instanceof ExternalApiError) {
      throw error;
    }
    throw new ExternalApiError("Network request failed", { url, originalError: error.message });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchPosts() {
  const cacheKey = "posts";
  const cached = cacheService.get(cacheKey);
  if (cached) return cached;

  const url = `${APP_CONFIG.jsonPlaceholderBaseUrl}/posts`;
  const posts = await fetchWithTimeout(url, {}, APP_CONFIG.requestTimeoutMs);

  if (!Array.isArray(posts)) {
    throw new ExternalApiError("Invalid posts response format");
  }

  cacheService.set(cacheKey, posts);
  return posts;
}

async function fetchUsers() {
  const cacheKey = "users";
  const cached = cacheService.get(cacheKey);
  if (cached) return cached;

  const url = `${APP_CONFIG.jsonPlaceholderBaseUrl}/users`;
  const users = await fetchWithTimeout(url, {}, APP_CONFIG.requestTimeoutMs);

  if (!Array.isArray(users)) {
    throw new ExternalApiError("Invalid users response format");
  }

  cacheService.set(cacheKey, users);
  return users;
}

async function fetchPostById(postId) {
  if (!Number.isInteger(postId) || postId <= 0) {
    throw new ExternalApiError("Post ID must be a positive integer", { postId });
  }

  const allPosts = await fetchPosts();
  const found = allPosts.find((post) => post.id === postId);
  if (!found) {
    return null;
  }
  return found;
}

export const jsonPlaceholderClient = {
  fetchPosts,
  fetchUsers,
  fetchPostById,
  ExternalApiError
};
