import express from "express";
import { AdminController } from "./admin.controller";
const router = express.Router();

router.get("/", AdminController.getAdminAllFromDB);

export const AdminRoutes = router;
