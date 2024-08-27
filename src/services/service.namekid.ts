import { PrismaClient,Prisma} from "@prisma/client"

const prisma = new PrismaClient()

//Buscar todos os nomes de crianças
export const getAllNameKid = async () =>{
  try {
    return await prisma.nameKid.findMany({
      include: {
        User: true,
      },
    })
  } catch (error) {
    return false
  }
  
}
// Buscar nome de criança por id
export const getNameKidById = async (id:number) =>{
  try {
    return await prisma.nameKid.findUnique({
      where:{id}, 
      include: {
      User: true,
    },})
  } catch (error) {
    return false
  }
}

//Adicionar um nome de criança
type nameKidCreateData = Prisma.Args<typeof prisma.nameKid, 'create'>['data']

export const createNameKid = async (data: nameKidCreateData) =>{
  try {
    // data.id_user = id_user
    return await prisma.nameKid.create({data})
  } catch (error) {
    return false
  }
}

//Atualizar um nome de criança

type nameKidUpdateData = Prisma.Args<typeof prisma.nameKid, 'update'>['data']
export const updateNameKid = async (id:number, data:nameKidUpdateData) =>{
  try {
    return await prisma.nameKid.update({where:{id}, data})
  } catch (error) {
    return false
  }
}

//Deletar um nome de criança
export const deleteNameKid = async (id:number) =>{
  try {
    return await prisma.nameKid.delete({where:{id}})
  } catch (error) {
    return false
  }
}
