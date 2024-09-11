import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
  const saltRounds = 10;
  try {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
        isBlocked,
      },
    });

    // 성공적으로 생성된 사용자 정보 응답
    res.json(user);
  } catch (error: any) {
    // Prisma에서 발생하는 unique constraint 에러 처리
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // 'P2002'는 Prisma에서 unique constraint 위반 시 발생하는 에러 코드
        return res.status(400).json({ message: "Email already exists." });
      }
    }

    // 그 외의 에러는 500 에러로 처리
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
