import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 이메일로 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
      JWT_SECRET,
      { expiresIn: "1h" } // 토큰의 만료 시간 설정 (예: 1시간)
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
