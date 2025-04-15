import * as bcrypt from "bcrypt";
import { UserRole } from "../../../generated/prisma";
import prisma from "../../../shared/prisma";

const createAdmin = async (data: any) => {
  const hashedPassword: string = await bcrypt.hash(data.password, 12);

  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });

    const createAdminData = await transactionClient.admin.create({
      data: data.admin,
    });
    return createAdminData;
  });

  console.log({ data });
  return result;
};

export const userService = {
  createAdmin,
};
