import { RequestHandler } from "express";
import { z } from "zod";
import * as servicesAuth from "../services/service.auth";


export const login:RequestHandler = (req,res) =>{
  const loginSchema = z.object({
    password: z.string()
  })
  const body = loginSchema.safeParse(req.body)
  if(!body.success) return res.status(400).json({error: "Dados Invalidos!"});

  //Validar senha e gerar o Token 
  if(servicesAuth.validadePassword(body.data.password)){
    return res.status(200).json({token: servicesAuth.createToken()})
  }
  return res.status(403).json({error: "Acesso Negado!"})

  //Retorno da requisição

}