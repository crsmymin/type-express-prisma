import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserById,
} from "../controllers/userController";
import authMiddleware from "../middleware/authMiddlewares";

const router: Router = Router();

router.get("/users", authMiddleware, getUsers);
router.post("/users", createUser);
router.get("/users/:id", authMiddleware, getUserById);
router.put("/users/:id", authMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, deleteUser);

export default router;
