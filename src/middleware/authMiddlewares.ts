import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

interface CustomRequest extends Request {
  user?: any;
}

const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace("Bearer", "").trim();
  console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error: any) {
    console.log("JWT Verification Error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
