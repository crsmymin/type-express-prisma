import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createNewCategory,
  deleteCategoryById,
} from "../controllers/categoryController";

const router: Router = Router();

router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategoryById);
router.post("/categories", createNewCategory);
router.delete("/categories/:id", deleteCategoryById);

export default router;
