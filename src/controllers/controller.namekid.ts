import { RequestHandler } from "express";
import * as servicesNamekid from "../services/service.namekid";
import { z } from "zod";

//Buscar todos os nomes de crianças com id do usuario nos votos
export const NamekidGetAll:RequestHandler = async (req,res) =>{
  const id_user = req.params.id_user;
  const names = await servicesNamekid.getAllNameKid();
  if(names) return res.status(200).json({names:names});
  res.status(500).json({message:"Internal Server Error"})
}
export const NamekidGetAllIdVote:RequestHandler = async (req,res) =>{
  const id_user = req.params.id_user;
  const names = await servicesNamekid.getAllNameKidId(parseInt(id_user));
  if(names) return res.status(200).json({names:names});
  res.status(500).json({message:"Internal Server Error"})
}

// Buscar nome de criança por id
export const NamekidGetById:RequestHandler = async (req, res) =>{
  const id = req.params.id;
  const name = await servicesNamekid.getNameKidById(parseInt(id));
  if(!name) return res.status(404).json({message: "Nome de criança não existe!"})
  res.status(200).json({name:name});
}

// Add um novo nome de criança
export const NamekidAdd:RequestHandler = async (req, res) =>{
  const id_user = req.params.id_user;
  const nameSchema = z.object({
    suggested_name: z.string(),
    sex:z.number(),
    description: z.string().optional(),
    id_user: z.number().default(parseInt(id_user)),
  })
  const body = nameSchema.safeParse(req.body)
  if(!body.success) return res.status(400).json({message: "Dados Invalidos!"});
  // Salvar no banco de dados

  const name = await servicesNamekid.createNameKid(body.data);
  if(name) return res.status(201).json({name:name});
  res.status(500).json({message:"Internal Server Error"})
}

//Atualizar um nome de criança
export const NamekidUpdate:RequestHandler = async (req, res) =>{
  const id = req.params.id;
  const id_user = req.params.id_user;
  const nameSchema = z.object({
    suggested_name: z.string().optional(),
    sex:z.number().optional(),
    descriptionName: z.string().optional()
  })
  const nameResult = await servicesNamekid.getNameKidById(parseInt(id));
  if(!nameResult) return res.status(404).json({message: "Nome de criança não existe!"})
  if (nameResult.id_user != parseInt(id_user)) return res.status(401).json({message: "Não autorizado!"})

  const body = nameSchema.safeParse(req.body)
  if(!body.success) return res.status(400).json({message: "Dados Invalidos!"});
  const name = await servicesNamekid.updateNameKid(parseInt(id), body.data);
  if(name) return res.status(200).json({name:name});
  res.status(500).json({message:"Internal Server Error"})
}

//Deletar um nome de criança
export const NamekidDelete:RequestHandler = async (req, res) =>{
  const id = req.params.id;
  const id_user = req.params.id_user;
  const name = await servicesNamekid.getNameKidById(parseInt(id));

  if(!name) return res.status(404).json({message: "Nome de criança não existe!"})

  if (name.id_user != parseInt(id_user)) return res.status(401).json({message: "Não autorizado!"})
    
  const result = await servicesNamekid.deleteNameKid(parseInt(id));
  if(result) return res.status(200).json({message:"Nome de criança deletado com sucesso!"});
  res.status(500).json({message:"Internal Server Error"})
}

//vote namekid
export const NamekidVote:RequestHandler = async (req, res) =>{
  const id_name = req.params.id_name;
  const id_user = req.params.id_user;
  const vote = req.body.vote;
  //pesquisear se ja exite um voto com esse id_name e o id_user
  const existVoteNameKid = await servicesNamekid.getVoteNameKid(parseInt(id_name), parseInt(id_user));
  if(existVoteNameKid) {
    const result = await servicesNamekid.updateVoteNameKid(existVoteNameKid.id, vote);
    if(result) return res.status(200).json({message:"Voto atualizado com sucesso!"});
    return res.status(500).json({message:"Internal Server Error"})
  }

  const result = await servicesNamekid.voteNameKid(parseInt(id_name), parseInt(id_user), vote);
  console.log(result);
  if(result) return res.status(200).json({message:"Voto registrado com sucesso!"});
  res.status(500).json({message:"Internal Server Error"})
}


