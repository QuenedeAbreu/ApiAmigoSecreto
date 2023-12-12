import { RequestHandler } from "express";
import { validadeToken } from "../../services/service.auth";

export const validadeLogin:RequestHandler = (req,res,next) =>{
  if(!req.headers.authorization){
    return res.status(401).json({message:"Token não informado!"})
  }
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  if(!validadeToken(token)){
    return res.status(403).json({message:"Acesso Negado!"})
  }
  next();
}
