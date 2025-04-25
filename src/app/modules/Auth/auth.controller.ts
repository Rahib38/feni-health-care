import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { authService } from "./auth.service";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logged in successfully..!",
    data: result,
  });
});


export const authController = {
    loginUser
}