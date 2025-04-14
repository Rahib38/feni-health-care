import { Prisma, PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();
const getAdminAllFromDB = async (params: any) => {
  const andCondions: Prisma.AdminWhereInput[] = [];

  const adminSearchAbleFields=["name", "email"]
 

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

  // console.dir(andCondions,{depth:"inifinity"})

  const whereConditions: Prisma.AdminWhereInput = { AND: andCondions };
  const result = await prisma.admin.findMany({
    where: whereConditions,
  });
  return result;
};

export const AdminService = {
  getAdminAllFromDB,
};
