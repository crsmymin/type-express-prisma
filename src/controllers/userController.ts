import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { email, name, password, role, isBlocked } = req.body;
  const saltRounds = await bcrypt.genSalt(10);
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
        isBlocked,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, name, password, role, isBlocked } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        email,
        name,
        password,
        role,
        isBlocked,
        updatedAt: new Date(),
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
