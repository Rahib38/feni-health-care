import { PrismaClient, UserRole } from "../../../generated/prisma";


const prisma = new PrismaClient()
const createAdmin = async (data:any) => {
    const userData = {
        email:data.admin.email,
        password: data.password,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async(transactionClient)=>{
        const createdUserData = await transactionClient.user.create({
            data: userData
        })

        const createAdminData = await transactionClient.admin.create({
            data: data.admin
        })
        return createAdminData
    })

    console.log({data})
    return result
};

export const userService = {
    createAdmin
}