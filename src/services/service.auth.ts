import { getToday } from "../utils/getToday"
import { PrismaClient,Prisma} from "@prisma/client"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import fs from 'fs'

const prisma = new PrismaClient()

type LoginUser = {email:string,password:string}
type returnValidadeLogin = {
  is_login:boolean,
  id?:number,
  message?:string,
  user?:{name:string,email:string}
}
export const validadeLogin = async (data:LoginUser ):Promise<returnValidadeLogin> =>{
    const {email,password} = data
    const user = await userGetByEmail(email)
    if(!user) return {
        is_login:false,
        message:"Email ou senha incorreto!"
      }
    const resultPassword = await bcrypt.compare(password,user.password)
      if(resultPassword && !user.is_active) return {
        is_login:false,
        message:"Usuario não está ativo!"
      }
      if(resultPassword) return {
        is_login:true,
        id:user.id,
        user:{
          name:user.name,
          email:user.email
        }
      }

  return {is_login:false,message:"Email ou senha incorreto!"}
}

export const createToken = (id: number) =>{
  const privateKey = fs.readFileSync('./private.key')
  const jwtToken = jwt.sign({id},privateKey,{algorithm:'RS256'})
  return jwtToken
}

export const validadeToken = (token: string) =>{
  const validToken = jwt.verify(token, fs.readFileSync('./private.key'))
  return true
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
