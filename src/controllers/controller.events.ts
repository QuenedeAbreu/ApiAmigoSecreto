import { RequestHandler } from "express";
import * as serviceEvents from '../services/service.events';
import { z } from "zod";

export const eventsGetAll:RequestHandler = async (req,res) =>{
  const items = await serviceEvents.eventsGetAll();
  
  if(items) return res.status(200).json({events:items});
  
  return res.status(404).json({message: 'Not found'});
}

export const eventsGetById:RequestHandler = async (req,res) =>{
  const id = req.params.id;
  const item = await serviceEvents.eventsGetById(parseInt(id));
  
  if(item) return res.status(200).json({event:item});
  
  return res.status(404).json({message: 'Not found'});

}

export const eventsAddEvent:RequestHandler = async (req,res) =>{
  const addEventSchema = z.object({
    title: z.string(),
    description: z.string(),
    grouped: z.boolean()
  })
  
  console.log(req.body);
  const data = addEventSchema.safeParse(req.body);
  console.log(data);
  if(!data.success) return res.status(400).json({error: 'Data Invalid!'});
  
  const newEvent  = await serviceEvents.eventAdd(data.data);
  if(newEvent) return res.status(201).json({event:newEvent});

  res.status(500).json({error:'Internal Server Error'})
}