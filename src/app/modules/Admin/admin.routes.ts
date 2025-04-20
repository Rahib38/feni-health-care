import express from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { AdminController } from "./admin.controller";
import { adminValidationSchema } from "./admin.validation";
const router = express.Router();

router.get("/", AdminController.getAdminAllFromDB);

router.get("/:id", AdminController.getByIdFromDB);

router.patch(
  "/:id",
  validateRequest(adminValidationSchema.update),
  AdminController.updateIntoDB
);

router.delete("/:id", AdminController.deleteIntoDB);

router.delete("/soft/:id", AdminController.softDeleteIntoDB);

export const AdminRoutes = router;
