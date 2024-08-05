import { RequestHandler } from "express";
import { z } from "zod";

import * as servicesEmail from "../services/service.email";
import * as servicesUser from "../services/service.auth";
import {generateTokenResetPassword} from '../utils/generateTokenResetPassword'


//Enviar email
export const SendEmailResetPassword:RequestHandler = async (req,res) =>{
  const {id_user} = req.params
  //pesquisar o usuario na base de dados
  const user = await servicesUser.userGetById(parseInt(id_user))

  if(!user) return res.status(404).json({message:"Usuário não encontrado!"})
    //gerar token para resetar senha
  const {resettoken,expiresToken} = generateTokenResetPassword()
    //setar o token e o tempo de expiração do token no banco de dados
    console.log(expiresToken);
    const ResultTokenReset = await servicesUser.setTokenResetPassword(parseInt(id_user),{resettoken,expiresToken})
    console.log(ResultTokenReset);
  
  //enviar email

  const parametEmail = {
    "to":user.email,
    "subject":"Redefinição de senha",
    "context":{
       "nameuser":user.name,
       "linkpasswordreset":"http://www.teste/"+resettoken
    }
   }
  
  
 
  const sendEmail = await servicesEmail.sendEmail(parametEmail)
  if(sendEmail) return res.status(200).json({message:"Email enviado com sucesso!"})
  res.status(500).json({message:"Internal Server Error"})
}