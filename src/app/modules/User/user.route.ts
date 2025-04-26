import express, { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { userController } from "./user.controller";

const router = express.Router();

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      console.log(token);

      if (!token) {
        throw new Error("You are not authorized..!");
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new Error("You are not authorized..!");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

router.post("/", auth("ADMIN", "SUPER_ADMIN"), userController.createAdmin);

export const userRoutes = router;
