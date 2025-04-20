import express, { NextFunction, Request, Response } from "express";
import { AnyZodObject, z } from "zod";
import { AdminController } from "./admin.controller";
const router = express.Router();

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
      });
      return next()
    } catch (err) {
      next(err);
    }
  };
};

router.get("/", AdminController.getAdminAllFromDB);

router.get("/:id", AdminController.getByIdFromDB);

router.patch("/:id", validateRequest(update), AdminController.updateIntoDB);

router.delete("/:id", AdminController.deleteIntoDB);

router.delete("/soft/:id", AdminController.softDeleteIntoDB);

export const AdminRoutes = router;
