import { RequestHandler } from "express";
import * as peopleService from "../services/service.people";
import * as utils from "../utils/match";
import { z } from "zod";

export const peopleGetAll: RequestHandler  = async (req,res) =>{
  const id_group =  req.params.id_group;
  const id_event =  req.params.id_event;

  const peoples = await peopleService.peopleGetAll({
    id_event:parseInt(id_event),
    id_group:parseInt(id_group)
  }); 
  if(peoples){return res.status(200).json({peoples});}
  return res.status(404).json({message:"Not found"})
}
export const peopleGetById: RequestHandler  = async (req,res) =>{
  const id =  req.params.id;
  const id_group =  req.params.id_group;
  const id_event =  req.params.id_event;
  const people = await peopleService.peopleGetById({
    id:parseInt(id),
    id_event:parseInt(id_event),
    id_group:parseInt(id_group)
  })
  
  if(people){return res.status(200).json({people});}
  return res.status(404).json({message:"Not found"})
}
export const peopleAdd: RequestHandler  = async (req,res) =>{
  const id_group =  req.params.id_group;
  const id_event =  req.params.id_event;
  const addPeopleSchema = z.object({
    name:z.string(),
    cpf:z.string().transform(val=>val.replace(/\.|-/gm,''))
  })
  const body = addPeopleSchema.safeParse(req.body);
  if(!body.success){
    return res.status(400).json({message:"Invalid data"})
  }
  const people = await peopleService.peopleAdd({
    id_event:parseInt(id_event),
    id_group:parseInt(id_group),
    ...body.data
  })
  if(people){return res.status(201).json({people});}
  return res.status(404).json({message:"Not found"})
}

export const peopleUpdate: RequestHandler  = async (req,res) =>{
  const id =  req.params.id;
  const id_group =  req.params.id_group;
  const id_event =  req.params.id_event;
  
  const addPeopleSchema = z.object({
    name:z.string().optional(),
    cpf:z.string().transform(val=>val.replace(/\.|-/gm,'')).optional(),
    matched:z.string().optional(),
  })
  const body = addPeopleSchema.safeParse(req.body);
  if(!body.success){
    return res.status(400).json({message:"Invalid data"})
  }
  const people = await peopleService.peopleUpdate({
    id:parseInt(id),
    id_event:parseInt(id_event),
    id_group:parseInt(id_group),
    ...body.data
  })

  if(people){
    const peopleItem = await peopleService.peopleGetById({
      id:parseInt(id),
      id_event:parseInt(id_event)
    })
    return res.status(200).json({peopleItem});
  }

  return res.status(404).json({message:"Not found"})
}
export const peopleDelete: RequestHandler  = async (req,res) =>{
  const id =  req.params.id;
  const id_group =  req.params.id_group;
  const id_event =  req.params.id_event;
  
  const people = await peopleService.peopleDelete({
    id:parseInt(id),
    id_event:parseInt(id_event),
    id_group:parseInt(id_group)
  })
  if(people){return res.status(200).json({people});}
  return res.status(404).json({message:"Not found"})
}
export const peopleSearch: RequestHandler  = async (req,res) =>{

  const id_event =  req.params.id_event;
  const searchPeopleSchema = z.object({
    cpf:z.string().transform(val=>val.replace(/\.|-/gm,''))
  })
  const query = searchPeopleSchema.safeParse(req.query);

  if(!query.success){
    return res.status(400).json({message:"Invalid data"})
  }
  const peopleItem = await peopleService.peopleGetById({
    id_event:parseInt(id_event),
    cpf:query.data.cpf
  })

  if(peopleItem && peopleItem.matched){
    const matchId = utils.decryptMatch(peopleItem.matched);
    console.log(matchId);
    const peopleMatch = await peopleService.peopleGetById({
      id_event:parseInt(id_event),
      id:matchId
    })
    if(peopleMatch){

      return res.status(200).json({
        people:{
          id:peopleItem.id,
          name:peopleItem.name
        },
        peopleMatch:{
          id:peopleMatch.id,
          name:peopleMatch.name
        }
      });
    }
  }
  
  return res.status(404).json({message:"Not found"})
}
