import * as bcrypt from "bcrypt";
import { jwtHelpers } from "./../../../helpers/jwtHelpers";

import prisma from "../../../shared/prisma";
import { UserStatus } from "../../../generated/prisma";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

const loginUser = async (payload: { email: string; password: string }) => {
  const result = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status:UserStatus.ACTIVE
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
      status:UserStatus.ACTIVE

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

export const authService = {
  loginUser,
  refreshToken,
};
