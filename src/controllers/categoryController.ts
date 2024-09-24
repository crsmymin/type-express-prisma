import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error getting categories", error });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: "Invalid category ID." });
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error getting category", error });
  }
};

export const createNewCategory = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required." });
  }

  try {
    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

export const deleteCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: "Invalid category ID." });
  }

  try {
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Category deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};
