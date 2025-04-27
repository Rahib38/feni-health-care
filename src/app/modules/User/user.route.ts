import express from "express";
import { auth } from "../../middleware/auth";
import { userController } from "./user.controller";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), userController.createAdmin);

export const userRoutes = router;
