import { Prisma, PrismaClient } from "../../../generated/prisma";
import { adminSearchAbleFields } from "./admin.constant";

const prisma = new PrismaClient();

const calculatePagination = (options: {
  page?: number;
  limit?: number;
  SortOrder?: string;
  sortBy?: string;
}) => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip: number = (Number(page) - 1) * limit;

  const sortBy: string = options.sortBy || "createdAt";
  const sortOrder: string = options.SortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

const getAdminAllFromDB = async (params: any, options: any) => {
  const andCondions: Prisma.AdminWhereInput[] = [];

  const {     page,
    limit,
    skip,} = calculatePagination(options);
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
  return result;
};

export const AdminService = {
  getAdminAllFromDB,
};
