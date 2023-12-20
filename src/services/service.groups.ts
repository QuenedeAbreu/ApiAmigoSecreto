import { PrismaClient,Prisma } from "@prisma/client"
const prisma = new PrismaClient()

export const groupsGetAll = async (id_event:number) =>{
  try {
    const groups = await prisma.eventGroup.findMany({
      where:{
        id_event
      }
    })
    return groups
  } catch (error) {
    return false;
  }

}