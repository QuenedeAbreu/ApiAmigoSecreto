import { PrismaClient,Prisma } from "@prisma/client"
const prisma = new PrismaClient()

export const eventsGetAll = async () =>{
  try {
    return await prisma.event.findMany();
  } catch (error) {
    return false;
  }
}

export const eventsGetById = async (id:number) =>{
  try {
      return await prisma.event.findFirst({where: {id}})
  } catch (error)  {
    return false;
  }
}


type EventCreateData = Prisma.Args<typeof prisma.event,'create'>['data']
export const eventAdd = async (data:EventCreateData) =>{
  try {
      return prisma.event.create({
        data
      })
  } catch (error) {
      return false
  }
}