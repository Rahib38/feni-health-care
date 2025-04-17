import { NextFunction, Request, Response } from "express";
import status from "http-status";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { adminFilterAbleFields } from "./admin.constant";
import { AdminService } from "./admin.service";

const getAdminAllFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(req.query);
  try {
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
  } catch (err) {
    next(err);
  }
};

const getByIdFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const result = await AdminService.getByIdFromDB(id);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin data fetched by id!",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateIntoDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  console.log("id", id);
  console.log("data", req.body);
  try {
    const result = await AdminService.updateIntoDB(id, req.body);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin data updated!",

      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteIntoDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  console.log("id", id);
  console.log("data", req.body);
  try {
    const result = await AdminService.deleteFromDB(id);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin data deleted!",

      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const softDeleteIntoDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  console.log("id", id);
  console.log("data", req.body);
  try {
    const result = await AdminService.softDeleteFromDB(id);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin data deleted!",

      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const AdminController = {
  getAdminAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteIntoDB,
  softDeleteIntoDB,
};
