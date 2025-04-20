import { NextFunction, Request, RequestHandler, Response } from "express";
import status from "http-status";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { adminFilterAbleFields } from "./admin.constant";
import { AdminService } from "./admin.service";
import { catchAsync } from "../../../shared/catchAsync";



const getAdminAllFromDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // console.log(req.query);

    const filters = pick(req.query, adminFilterAbleFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    console.log(options);
    const result = await AdminService.getAdminAllFromDB(filters, options);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin data fetched!",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getByIdFromDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await AdminService.getByIdFromDB(id);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin data fetched by id!",
      data: result,
    });
  }
);

const updateIntoDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("id", id);
    console.log("data", req.body);

    const result = await AdminService.updateIntoDB(id, req.body);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin data updated!",

      data: result,
    });
  }
);
const deleteIntoDB: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log("id", id);
    console.log("data", req.body);

    const result = await AdminService.deleteFromDB(id);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin data deleted!",

      data: result,
    });
  }
);

const softDeleteIntoDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("id", id);
    console.log("data", req.body);

    const result = await AdminService.softDeleteFromDB(id);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin data deleted!",

      data: result,
    });
  }
);
export const AdminController = {
  getAdminAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteIntoDB,
  softDeleteIntoDB,
};
