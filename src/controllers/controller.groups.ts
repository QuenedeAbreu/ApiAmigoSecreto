import { RequestHandler } from "express";
import * as serviceGroups from "../services/service.groups"
import { z } from "zod";

export const groupsGetAll:RequestHandler = async (req,res)=>{
  const id_event =  req.params.id_event;
  const item = await serviceGroups.groupsGetAll(parseInt(id_event))
 
  if(item){
    return res.status(200).json({groups:item})
  }
  return res.status(404).json({message:"Not found"})

}
export const groupsGetById:RequestHandler = async (req,res)=>{
  const id_event =  req.params.id_event;
  const id = req.params.id;
  const item = await serviceGroups.groupsGetById({
    id:parseInt(id),
    id_event:parseInt(id_event)
  })
 
  if(item){
    return res.status(200).json({group:item})
  }
  return res.status(404).json({message:"Not found"})

}
export const groupsAdd:RequestHandler = async (req,res)=>{
  const id_event =  req.params.id_event;
  const addGroupSchema = z.object({
    name:z.string()
  })
  const body = addGroupSchema.safeParse(req.body)
  if(!body.success){
    return res.status(400).json({message:"Invalid body"})
  }
  const newGroupitem = await serviceGroups.groupsAdd({
    ...body.data,
    id_event:parseInt(id_event)
  })
 
  if(newGroupitem){
    return res.status(200).json({group:newGroupitem})
  }
  return res.status(404).json({message:"Not found"})

}
export const groupsUpdate:RequestHandler = async (req,res)=>{
  const id_event =  req.params.id_event;
  const id = req.params.id;
  const updateGroupSchema = z.object({
    name:z.string().optional()
  })
  const body = updateGroupSchema.safeParse(req.body)
  if(!body.success){
    return res.status(400).json({message:"Invalid body"})
  }
  const updateGroupitem = await serviceGroups.groupsUpdate({
    ...body.data,
    id:parseInt(id),
    id_event:parseInt(id_event)
  })
 
  if(updateGroupitem){
    return res.status(200).json({group:updateGroupitem})
  }
  return res.status(404).json({message:"Not found"})

}
export const groupsDelete:RequestHandler = async (req,res)=>{
  const id_event =  req.params.id_event;
  const id = req.params.id;
  const item = await serviceGroups.groupsDelete({
    id:parseInt(id),
    id_event:parseInt(id_event)
  })
 
  if(item){
    return res.status(200).json({group:item})
  }
  return res.status(404).json({message:"Not found"})

}