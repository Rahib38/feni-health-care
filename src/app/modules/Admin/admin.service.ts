import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient()
const getAdminAllFromDB = async()=>{
    const result = await prisma.admin.findMany();
    return result
}

export const AdminService={
    getAdminAllFromDB
}