import { getToday } from "../utils/getToday"
import 'dotenv/config';
import { PrismaClient,Prisma} from "@prisma/client"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import transporter from '../modules/mailer'
import {generateTokenResetPassword} from '../utils/generateTokenResetPassword'
import path from "path";


const prisma = new PrismaClient()

type LoginUser = {email:string,password:string}
type returnValidadeLogin = {
  is_login:boolean,
  id?:number,
  message?:string,
  user?:{name:string,email:string,is_admin:boolean,is_acessall:Boolean}
}
export const validadeLogin = async (data:LoginUser ):Promise<returnValidadeLogin> =>{
    const {email,password} = data
    const user = await userGetByEmail(email)
    if(user){
      if(!user.is_acessall) return {
        is_login:false,
        message:"Este tipo de usuário não pode logar por está pagina!"
      }
    }
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
          email:user.email,
          is_admin:user.is_admin,
          is_acessall:user.is_acessall
        }
      }

  return {is_login:false,message:"Email ou senha incorreto!"}
}

type LoginUserFromTokenname = {tokenname:string}
export const validadeLoginFromTokenname = async (data:LoginUserFromTokenname ):Promise<returnValidadeLogin > =>{
  const {tokenname} = data
   const user = await userGetByTokenName(tokenname)
 
  if(!user) return {
      is_login:false,
      message:"Usuário não encontrado!"
    }
    if( !user.is_active) return {
      is_login:false,
      message:"Usuario não está ativo!"
    }
  
    if(user) return {
      is_login:true,
      id:user.id,
      user:{
        name:user.name,
        email:user.email,
        is_admin:user.is_admin,
        is_acessall:user.is_acessall
      }
    }
    return {is_login:false,message:"Email ou senha incorreto!"}
  }

export const createToken = (id: number) =>{
  // const privateKey = fs.readFileSync('private.key')
  const privateKey = process.env.DEFAULT_TOKEN_CRYPTO as string
  const jwtToken = jwt.sign({id},privateKey,{algorithm:'RS256'})
  return jwtToken
}

export const validadeToken = (token: string) =>{
  try {
    // const validToken = jwt.verify(token, fs.readFileSync('private.key'))
    const validToken = jwt.verify(token, process.env.DEFAULT_TOKEN_CRYPTO as string)
    return true
  } catch (error) {
    return false
  }
    
  // if(!validToken) return false
}

//Busacar todos os usuairos
export const userGetAll = async () =>{
  try {
    return prisma.user.findMany()
  } catch (error) {
    return false
  }
}

//Buscar um usuario pelo tokenname
export const userGetByTokenName = async (nametoken:string) =>{
  try {
    return prisma.user.findFirst({where:{nametoken}})
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
    const {resettoken} = generateTokenResetPassword()
    user.nametoken = resettoken
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

// Update ResetToken e expireToken
type UserUpdateResetTokenData = Prisma.Args<typeof prisma.user, 'update'>['data']
export const setTokenResetPassword = async (id:number, user:UserUpdateResetTokenData) =>{
  try {
    return prisma.user.update({where:{id}, data:user})
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

interface EmailContextResetPassword {
  to:string;
  subject:string;
  context:{
    nameuser: string;
    linkpasswordreset: string;
  } 

}

export const sendEmailForgotPassword = async ({to,subject,context}: EmailContextResetPassword) => {
  try {
    const mailOptions = {
      from: 'Amigo Oculto <quenede.in@gmail.com>',
      to: to,
      subject: subject,
      template:path.join(__dirname, 'views', 'email', 'senhaView.hbs'),
      context: context // passamos o contexto para o template
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado: ' + info.response);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email: ', error);
    return false;
  }
};


interface EmailContextCreateUser{
  to:string;
  subject:string;
  context:{
    nameuser: string;
    link: string;
  } 

}
export const sendEmailNewUserName = async ({to,subject,context}: EmailContextCreateUser) => {
  try {
    const mailOptions = {
      from: 'Sugestão de Nome <quenede.in@gmail.com>',
      to: to,
      subject: subject,
      template: 'nomeView',
      context: context // passamos o contexto para o template
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado: ' + info.response);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email: ', error);
    return false;
  }
};

export const userGetByResetToken = async (reset_token:string) =>{
  try {
    return prisma.user.findFirst({where:{resettoken:reset_token}})
  } catch (error) {
    return false
  }
}

export const resetPassword = async (id:number, password:string) =>{
  try {
    return prisma.user.update({where:{id}, data:{password}})
  } catch (error) {
    return false
  }
}
//excluir o token e a data de expiração do banco de dados
export const deleteTokenResetPassword = async (id:number) =>{
  try {
    return prisma.user.update({where:{id}, data:{resettoken:null,expiresToken:null}})
  } catch (error) {
    return false
  }
}

