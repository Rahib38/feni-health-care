import { Admin, Prisma, UserStatus } from "../../../generated/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { adminSearchAbleFields } from "./admin.constant";

const getAdminAllFromDB = async (params: any, options: any) => {
  const andCondions: Prisma.AdminWhereInput[] = [];

  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  console.log(filterData);

  if (params.searchTerm) {
    andCondions.push({
      OR: adminSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  andCondions.push({
    isDeleted: false,
  });

  // console.dir(andCondions,{depth:"inifinity"})

  const whereConditions: Prisma.AdminWhereInput = { AND: andCondions };
  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.SortOrder
        ? {
            [options.sortBy]: options.SortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.admin.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin | null> => {
  const isExist = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new Error("User not found!");
  }

  const result = await prisma.admin.update({
    where: {
      id,
      isDeleted: false,
    },
    data,
  });
  return result;
};

const deleteFromDB = async (id: string) => {
  const isExists = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (!isExists) {
    throw new Error("User Already deleted");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });
    return adminDeletedData;
  });
  return result;
  console.log("delete!", id);
};

const softDeleteFromDB = async (id: string) => {
  const isExists = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!isExists) {
    throw new Error("User Already deleted");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return adminDeletedData;
  });
  return result;
  console.log("delete!", id);
};

export const AdminService = {
  getAdminAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
