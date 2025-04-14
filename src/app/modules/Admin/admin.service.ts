import { Prisma, PrismaClient } from "../../../generated/prisma";
import { adminSearchAbleFields } from "./admin.constant";

const prisma = new PrismaClient();



const getAdminAllFromDB = async (params: any, options:any) => {
  const andCondions: Prisma.AdminWhereInput[] = [];

  const {limit,page}=options
  const {searchTerm,...filterData}=params
  console.log(filterData)


 

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

  if(Object.keys(filterData).length>0){
    andCondions.push({
        AND:Object.keys(filterData).map(key=>({
            [key]:{
                equals:filterData[key]
            }
        }))
    })
  }

  // console.dir(andCondions,{depth:"inifinity"})

  const whereConditions: Prisma.AdminWhereInput = { AND: andCondions };
  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip:(Number(page)-1)*limit,
    take:Number(limit)
  });
  return result;
};

export const AdminService = {
  getAdminAllFromDB,
};
