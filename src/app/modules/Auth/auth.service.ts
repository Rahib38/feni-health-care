import * as bcrypt from "bcrypt";
import { jwtHelpers } from "./../../../helpers/jwtHelpers";

import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { UserStatus } from "../../../generated/prisma";
import prisma from "../../../shared/prisma";

const loginUser = async (payload: { email: string; password: string }) => {
  const result = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    result?.password as string
  );

  if (!isCorrectPassword) {
    throw new Error("password incorrect.!");
  }

  const accessToken = jwtHelpers.generateToken(
    { email: result?.email, role: result?.role },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    { email: result?.email, role: result?.role },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  console.log({ accessToken });
  return {
    accessToken,
    refreshToken,
    needPasswordChange: result?.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(token, "xyz");
    console.log(decodedData);
  } catch (err) {
    throw new Error("You are not authorized.!");
  }

  const result = await prisma.user.findUnique({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    { email: result?.email, role: result?.role },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );
  return {
    accessToken,
    needPasswordChange: result?.needPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  const result = await prisma.user.findUnique({
    where: { email: user.email, status: UserStatus.ACTIVE },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    result?.password as string
  );
  if (!isCorrectPassword) {
    throw new Error("password incorrect.!");
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: result?.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
  return {
    message: "Password change successfully",
  };
  console.log("change");
};

export const authService = {
  loginUser,
  refreshToken,
  changePassword,
};
