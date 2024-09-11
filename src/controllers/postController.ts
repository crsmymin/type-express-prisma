import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving posts" });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving post" });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const { title, description, content, authorId } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        title,
        description,
        content,
        authorId,
      },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, content, published } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        content,
        published,
        updatedAt: new Date(),
      },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
};
