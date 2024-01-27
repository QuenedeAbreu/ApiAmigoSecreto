import { getToday } from "../utils/getToday"
import { PrismaClient,Prisma} from "@prisma/client"

const prisma = new PrismaClient()

export const validadePassword = (password:string ):boolean =>{
  const currentPassword = getToday().split('/').join('')
  return password === currentPassword
}

export const createToken = () =>{
  const currentPassword = getToday().split('/').join('')
  return `${process.env.DEFAULT_TOKEN}${currentPassword}`
}

export const validadeToken = (token: string) =>{
  const currentToken = createToken()
  // console.log(token);
  return token === `${currentToken}`
}

//Busacar todos os usuairos
export const userGetAll = async () =>{
  try {
    return prisma.user.findMany()
  } catch (error) {
    return false
  }
}

//Buscar um usuario pelo email
export const userGetByEmail = async (email:string) =>{
  try {
    return prisma.user.findFirst({where:{email}})
  } catch (error) {
    return false
  }
}

//Buscar um usuario pelo id
export const userGetById = async (id:number) =>{
  try {
    return prisma.user.findFirst({where:{id}})
  } catch (error) {
    return false
  }
}

//Adicionar um novo usuario 
type UserCreateData = Prisma.Args<typeof prisma.user, 'create'>['data']
export const userAdd = async (user:UserCreateData) =>{
  try {
    return prisma.user.create({data:user})
  } catch (error) {
    return false
  }
}

// Editar um usuario
type UserUpdateData = Prisma.Args<typeof prisma.user, 'update'>['data']
export const userUpdate = async (id:number, user:UserUpdateData) =>{
  try {
    return prisma.user.update({where:{id},data:user})
  } catch (error) {
    return false
  }
}

//Indativar um usuario
type UserUpdateStatusData = Prisma.Args<typeof prisma.user, 'update'>['data']
export const userUpdateStatus = async (id:number, user:UserUpdateStatusData) =>{
  try {
    return prisma.user.update({where:{id},data:user})
  } catch (error) {
    return false
  }
}
