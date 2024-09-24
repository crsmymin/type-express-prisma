import { Router } from "express";
import { loginUser } from "../controllers/authController";

const router: Router = Router();

// 로그인 라우트
router.post("/login", loginUser);

export default router;
