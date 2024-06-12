import { RequestHandler } from "express";
import { z } from "zod";
import * as servicesAuth from "../services/service.auth";
import bcrypt from "bcrypt";


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
      password: z.string()
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
  const user = await servicesAuth.userGetAll();
  if(user) return res.status(200).json({exists:true});
  res.status(200).json({exists:false});
}

  
// Adicionar usuario
export const UserAdd:RequestHandler = async (req,res) =>{
  const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
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
    return res.status(200).json({token: servicesAuth.createToken(userLogin.id)})
    }
  }
  return res.status(403).json(userLogin)
}