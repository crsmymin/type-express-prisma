import { Router } from "express";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController";
import authMiddleware from "../middleware/authMiddlewares";

const router = Router();

router.get("/posts", authMiddleware, getPosts);
router.get("/posts/:id", authMiddleware, getPostById);
router.post("/posts", authMiddleware, createPost);
router.put("/posts/:id", authMiddleware, updatePost);
router.delete("/posts/:id", authMiddleware, deletePost);

export default router;
