import { RequestHandler } from "express";
import * as serviceEvents from '../services/service.events';
import * as servicePeople from '../services/service.people'
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
    grouped: z.boolean(),
    id_user: z.number().optional()
  })
  
  // console.log(req.body);
  const data = addEventSchema.safeParse(req.body);
  // console.log(data);
  if(!data.success) return res.status(400).json({error: 'Data Invalid!'});
  
  const newEvent  = await serviceEvents.eventAdd(data.data);
  if(newEvent) return res.status(201).json({event:newEvent});

  res.status(500).json({error:'Internal Server Error'})
}

export const eventsUpdateEvent:RequestHandler = async (req,res) =>{
  const id = req.params.id;
  const updateEventSchema = z.object({
    status: z.boolean().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    grouped: z.boolean().optional()
  })
  
  const body = updateEventSchema.safeParse(req.body);
  if(!body.success) return res.status(400).json({error: 'Data Invalid!'});
  
  const updateEvent = await serviceEvents.eventUpdate(parseInt(id),body.data);

  if(updateEvent){
    if(updateEvent.status){
      // Fazer o sorteio
      const DrawResult = await serviceEvents.doMatch(parseInt(id));
      //console.log(DrawResult);
      if(!DrawResult){
        await serviceEvents.eventUpdate(parseInt(id), {status:false})
        return res.status(500).json({error:'Sorteio não realizado!'})
      }
      
    }else{
      //Limpar o sorteio
      await servicePeople.peopleUpdate({
        matched:'',
        id_event: parseInt(id)
      })
    }
    return res.status(200).json({event:updateEvent});
  } 

  res.status(500).json({error:'Internal Server Error'})
}

export const eventsDeleteEvent:RequestHandler = async (req,res) =>{
  const id = req.params.id;
  const deleteEvent = await serviceEvents.eventDelete(parseInt(id));
  if(deleteEvent) return res.status(200).json({event:deleteEvent});

  res.status(500).json({error:'Internal Server Error'})
}