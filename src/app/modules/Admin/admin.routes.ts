import express, { Request, Response } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { AdminController } from "./admin.controller";
const router = express.Router();

const prisma = new PrismaClient();

router.get("/", AdminController.getAdminAllFromDB);

export const AdminRoutes = router;