import express from "express";
import { UserRole } from "../../../generated/prisma";
import { auth } from "../../middleware/auth";
import { authController } from "./auth.controller";
const router = express.Router();

router.post("/login", authController.loginUser);

router.post("/refresh-token", authController.refreshToken);

router.post(
  "/passwordChange",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),
  authController.changePassword
);

export const AuthRoutes = router;
