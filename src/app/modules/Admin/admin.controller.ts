import { Request, Response } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { AdminService } from "./admin.service";

const prisma = new PrismaClient();
const getAdminAllFromDB = async (req: Request, res: Response) => {
    const result = await AdminService.getAdminAllFromDB()
  res.status(200).json({
    success: true,
    message: "Admin data fetched!",
    data: result,
  });
};

export const AdminController = {
  getAdminAllFromDB,
};
