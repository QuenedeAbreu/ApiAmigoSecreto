import { RequestHandler } from "express";
import { z } from "zod";
import * as servicesAuth from "../services/service.auth";
import * as servicesUser from "../services/service.auth";
import {generateTokenResetPassword} from '../utils/generateTokenResetPassword'
import bcrypt from "bcrypt";
import {generateDateEn} from '../utils/getToday'


//Pegar todos os usuarios
export const UserGetAll:RequestHandler = async (req,res) =>{
  const users = await servicesAuth.userGetAll();
  if(users) return res.status(200).json({users:users});
  res.status(500).json({message:"Internal Server Error"})
}

export const UserGetById:RequestHandler = async (req,res) =>{
  const id = req.params.id;
  const user = await servicesAuth.userGetById(parseInt(id));
  if(!user) return res.status(404).json({message: "Usuario não existe!"})
  if(user) return res.status(200).json({user:user});
  res.status(500).json({message:"Internal Server Error"})
}

//Adcionar o primeior Usuario
export const UserAddFirst:RequestHandler = async (req, res) =>{
    const userSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
      is_active: z.boolean().optional().default(true),
      is_admin: z.boolean().optional().default(true)
    })
   
    const body = userSchema.safeParse(req.body)
    if(!body.success) return res.status(400).json({message: "Dados Invalidos!"});

    //Validar se ja existe usuario
    const existUser = await servicesAuth.userGetAll();
    if(existUser != false || existUser == null) return res.status(308).json({message: "Já existe usuáriario cadastrado. Use a rota Principal!"})
    
    const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_BCRYPT as string));
    const hash = bcrypt.hashSync(body.data.password, salt);
    body.data.password = hash;
    //Adicionar um novo usuario
    const newUser = await servicesAuth.userAdd(body.data);
    if(newUser) return res.status(201).json({user:newUser});  
    res.status(500).json({message:"Internal Server Error"})
  }

export const verifyExistsUser:RequestHandler = async (req, res) =>{
  const existUser = await servicesAuth.userGetAll();
  //Validar se ja existe usuario;
  if(existUser != false || existUser == null) return res.status(200).json({exists:false});
  res.status(200).json({exists:true});
}

// Adicionar usuario
export const UserAdd:RequestHandler = async (req,res) =>{
  const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    is_active: z.boolean().optional().default(true),
    is_admin: z.boolean().optional().default(false)
  })
  const body = userSchema.safeParse(req.body)
  if(!body.success) return res.status(400).json({message: "Dados Invalidos!"});
  
  //Validar se o usuario ja existe
  const user = await servicesAuth.userGetByEmail(body.data.email);
  if(user) return res.status(400).json({message: "Usuario ja existe!"});
  
  const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_BCRYPT as string));
  const hash = bcrypt.hashSync(body.data.password, salt);
  body.data.password = hash;

  //Adicionar um novo usuario
  const newUser = await servicesAuth.userAdd(body.data);
  if(newUser) return res.status(201).json({user:newUser});
  res.status(500).json({message:"Internal Server Error"})
}

// Editar um usuario
export const UserUpdate:RequestHandler = async (req,res) =>{
  const id = req.params.id;
  const updateUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().optional()
  })
  const body = updateUserSchema.safeParse(req.body)
  if(!body.success) return res.status(400).json({message: "Dados Invalidos!"});

  //Validar se o usuario existe
  const user = await servicesAuth.userGetById(parseInt(id));
  if(!user) return res.status(404).json({message: "Usuario não existe!"});
  
  //validar de o email informado ja existe se não o email é do proprio usuaior
  if(body.data.email){
    const existEmail = await servicesAuth.userGetByEmail(body.data.email);
    if(existEmail && existEmail.id != parseInt(id)) return res.status(400).json({message: "Email ja existe!"});
  }
  
  // Encrypt senha
  if(body.data.password){
    const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_BCRYPT as string));
    const hash = bcrypt.hashSync(body.data.password, salt);
    body.data.password = hash;
  }

  //Atualizar o usuario
  const updateUser = await servicesAuth.userUpdate(parseInt(id),body.data);
  if(updateUser) return res.status(200).json({user:updateUser});
  res.status(500).json({message:"Internal Server Error"})
}

// Indativar Usuario
export const UserUpdateStatus:RequestHandler = async (req,res) =>{
  const id = req.params.id;
  const userUpdateStatusSchema = z.object({
    is_active: z.boolean()
  })
  const body = userUpdateStatusSchema.safeParse(req.body)
  if(!body.success) return res.status(400).json({message: "Dados Invalidos!"});

  //Validar se o usuario existe
  const user = await servicesAuth.userGetById(parseInt(id));
  if(!user) return res.status(404).json({message: "Usuario não existe!"});

  //Atualizar o usuario
  const updateUser = await servicesAuth.userUpdateStatus(parseInt(id),body.data);
  if(updateUser) return res.status(200).json({user:updateUser});
  res.status(500).json({message:"Internal Server Error"})
}

export const login:RequestHandler = async (req,res) =>{
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
  })
  const body = loginSchema.safeParse(req.body)
  if(!body.success) return res.status(400).json({message: "Dados Invalidos!"});

  //Validar senha e gerar o Token 
  const userLogin = await servicesAuth.validadeLogin(body.data)
  if(userLogin.is_login){
    if(userLogin.id){
    return res.status(200).json({token: servicesAuth.createToken(userLogin.id),user:userLogin.user})
    }
  }
  return res.status(403).json(userLogin)
}


//Forgot Password
export const SendEmailForgotPassword:RequestHandler = async (req,res) =>{
  const {id_user} = req.params
  //pesquisar o usuario na base de dados
  const user = await servicesUser.userGetById(parseInt(id_user))

  if(!user) return res.status(404).json({message:"Usuário não encontrado!"})
    //gerar token para resetar senha
  const {resettoken,expiresToken} = generateTokenResetPassword()
    //setar o token e o tempo de expiração do token no banco de dados
    const ResultTokenReset = await servicesUser.setTokenResetPassword(parseInt(id_user),{resettoken,expiresToken})
  res.status(200).json({ResultTokenReset})
  //enviar email

  // const parametEmail = {
  //   "to":user.email,
  //   "subject":"Redefinição de senha",
  //   "context":{
  //      "nameuser":user.name,
  //      "linkpasswordreset":"http://www.teste/"+resettoken
  //   }
  //  }
  
  
 
  // const sendEmail = await servicesAuth.sendEmailForgotPassword(parametEmail)
  // if(sendEmail) return res.status(200).json({message:"Email enviado com sucesso!"})
  // res.status(500).json({message:"Internal Server Error"})
}
//Reset Password
export const ResetPassword:RequestHandler = async (req, res) =>{
  const {reset_token} = req.params
  const {password} = req.body
  

  const user = await servicesUser.userGetByResetToken(reset_token)
  if(!user) return res.status(404).json({message:"Token invalido!"})

  if(user.expiresToken){
  if(new Date(user.expiresToken) < new Date(generateDateEn())){
    return res.status(400).json({message:"Token expirado!"})
    }  
  }

  const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_BCRYPT as string));
  const hash = bcrypt.hashSync(password, salt);

  const resultResetPassword = await servicesUser.resetPassword(user.id, hash)
  if(resultResetPassword){
      //excluir o token e a data de expiração do banco de dados
      const resultDeleteToken = await servicesUser.deleteTokenResetPassword(user.id)
      if(resultDeleteToken) return res.status(200).json({message:"Senha alterada com sucesso!"})
  }

  res.status(500).json({message:"Internal Server Error"})
}

