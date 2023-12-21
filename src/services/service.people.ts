import { PrismaClient,Prisma } from "@prisma/client";
import * as serviceGroup from "./service.groups";

const prisma = new PrismaClient();
type GelAllPeople = {id_group?:number,id_event:number};
export const peopleGetAll = async(data:GelAllPeople) =>{
  try {
    return await prisma.eventPeople.findMany({
      where:data
    });
    
  
    
  } catch (error) {return false}
}

type GetOnePeople = {id_group?:number,id_event:number,id?:number,cpf?:string};
export const peopleGetById = async(data:GetOnePeople) =>{
  try {
    if(!data.id && !data.cpf){return false}
    return await prisma.eventPeople.findFirst({
      where:data
    });
  } catch (error) {return false}
}

type PostPeopleData = Prisma .Args<typeof prisma.eventPeople,'create'>['data']
export const peopleAdd = async(data:PostPeopleData) =>{
  try {
    if(!data.id_group) return false;
    const group = await serviceGroup.groupsGetById({
        id:data.id_group,
        id_event:data.id_event
      })
      if(!group){return false}

    return await prisma.eventPeople.create({data});
  } catch (error) {return false}
}

type PutUpdatePeopleData = Prisma.Args<typeof prisma.eventPeople,'update'>['data'] & {id?:number,id_event:number,id_group?:number}
export const peopleUpdate = async(data:PutUpdatePeopleData) =>{
  try {
    return await prisma.eventPeople.updateMany({
      where:{
      id:data.id,
      id_event:data.id_event,
      id_group:data.id_group
    },
    data
  });
  } catch (error) {return false}
}

type DeletePeopleData = {id:number,id_event?:number,id_group?:number}
export const peopleDelete = async(data:DeletePeopleData) =>{
  try {
    return await prisma.eventPeople.delete({
      where:data
      
    });
  } catch (error) {return false}
}
