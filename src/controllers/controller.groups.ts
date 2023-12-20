import { RequestHandler } from "express";
import * as serviceGroups from "../services/service.groups"

export const groupsGetAll:RequestHandler = async (req,res)=>{
  const id_event =  req.params.id_event;
  const item = await serviceGroups.groupsGetAll(parseInt(id_event))
 
  if(item){
    return res.status(200).json({groups:item})
  }
  return res.status(404).json({message:"Not found"})

}