import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterAbleFields } from "./admin.constant";



const getAdminAllFromDB = async (req: Request, res: Response) => {
  // console.log(req.query);
  try {
    const filters = pick(req.query,adminFilterAbleFields);
    const options = pick(req.query,["limit","page","sortBy","sortOrder"]);
    console.log(options)
    const result = await AdminService.getAdminAllFromDB(filters,options);
    res.status(200).json({
      success: true,
      message: "Admin data fetched!",
      meta:result.meta,
      data: result.data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err?.name || "Something went wrong!",
      error: err,
    });
  }
};

export const AdminController = {
  getAdminAllFromDB,
};
