import express from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { AdminController } from "./admin.controller";
import { adminValidationSchema } from "./admin.validation";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma";
const router = express.Router();

router.get("/", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),AdminController.getAdminAllFromDB);

router.get("/:id",auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), AdminController.getByIdFromDB);

router.patch(
  "/:id",auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(adminValidationSchema.update),
  AdminController.updateIntoDB
);

router.delete("/:id",auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),AdminController.deleteIntoDB);

router.delete("/soft/:id", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),AdminController.softDeleteIntoDB);

export const AdminRoutes = router;
