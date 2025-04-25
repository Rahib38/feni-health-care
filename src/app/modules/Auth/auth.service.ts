import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


import prisma from "../../../shared/prisma";
import { generateToken } from "../../../helpers/jwtHelpers";



const loginUser = async (payload: { email: string; password: string }) => {
  const result = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    result?.password as string
  );

  if (!isCorrectPassword) {
    throw new Error("password incorrect.!");
  }

  const accessToken = generateToken({email:result?.email, role:result?.role},"abc","5m")
  
  const refreshToken = generateToken({email:result?.email, role:result?.role},"xyz","30d")


  console.log({ accessToken });
  return {
    accessToken,
    refreshToken,
    needPasswordChange: result?.needPasswordChange,
  };
};

export const authService = {
  loginUser,
};
