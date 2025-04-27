import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { authService } from "./auth.service";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);

  const { refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logged in successfully..!",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await authService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logged in successfully..!",
    data: result,
    // data: {
    //   accessToken:result.accessToken,
    //   needPasswordChange:result.needPasswordChange
    // },
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.changePassword(req.user, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "password change successfully..!",
    data: result,
  });
});

export const authController = {
  loginUser,
  refreshToken,
  changePassword,
};
