import express from "express";
import { jsonPlaceholderClient } from "../services/jsonPlaceholderClient.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { userId, title, limit = 20, offset = 0 } = req.query;

    const [posts, users] = await Promise.all([
      jsonPlaceholderClient.fetchPosts(),
      jsonPlaceholderClient.fetchUsers()
    ]);

    let filteredPosts = posts;

    // Filter by userId
    if (userId !== undefined) {
      const parsedUserId = Number(userId);
      if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
        return res.status(400).json({
          error: "ValidationError",
          message: "userId must be a positive integer"
        });
      }
      filteredPosts = filteredPosts.filter((post) => post.userId === parsedUserId);
    }

    // Filter by title substring
    if (title) {
      const lowered = String(title).toLowerCase();
      filteredPosts = filteredPosts.filter((post) =>
        post.title.toLowerCase().includes(lowered)
      );
    }

    // Pagination
    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);

    if (!Number.isInteger(parsedLimit) || parsedLimit <= 0 || parsedLimit > 100) {
      return res.status(400).json({
        error: "ValidationError",
        message: "limit must be an integer between 1 and 100"
      });
    }

    if (!Number.isInteger(parsedOffset) || parsedOffset < 0) {
      return res.status(400).json({
        error: "ValidationError",
        message: "offset must be a non-negative integer"
      });
    }

    const paginated = filteredPosts.slice(parsedOffset, parsedOffset + parsedLimit);

    // Attaching basic user info for each post
    const usersById = new Map(users.map((user) => [user.id, user]));
    const postsWithUser = paginated.map((post) => ({
      ...post,
      user: usersById.get(post.userId)
        ? {
            id: usersById.get(post.userId).id,
            name: usersById.get(post.userId).name,
            email: usersById.get(post.userId).email
          }
        : null
    }));

    res.json({
      total: filteredPosts.length,
      limit: parsedLimit,
      offset: parsedOffset,
      items: postsWithUser
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/posts/:id
router.get("/:id", async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Post ID must be a positive integer"
      });
    }

    const [post, users] = await Promise.all([
      jsonPlaceholderClient.fetchPostById(postId),
      jsonPlaceholderClient.fetchUsers()
    ]);

    if (!post) {
      return res.status(404).json({
        error: "NotFound",
        message: `Post with id ${postId} not found`
      });
    }

    const user = users.find((u) => u.id === post.userId) || null;

    res.json({
      ...post,
      user
    });
  } catch (error) {
    next(error);
  }
});

export { router as postsRouter };
