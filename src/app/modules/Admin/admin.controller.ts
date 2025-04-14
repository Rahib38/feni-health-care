import { Request, Response } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { AdminService } from "./admin.service";

const prisma = new PrismaClient();
const getAdminAllFromDB = async (req: Request, res: Response) => {
  // console.log(req.query);
  try{
    const result = await AdminService.getAdminAllFromDB(req.query);
    res.status(200).json({
      success: true,
      message: "Admin data fetched!",
      data: result,
    });
  }catch(err){
    res.status(500).json({
      success:false,
      message:err?.name || "Something went wrong!",
      error: err
  })
  }
};

export const AdminController = {
  getAdminAllFromDB,
};
