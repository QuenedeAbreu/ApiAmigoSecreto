import { PrismaClient,Prisma } from "@prisma/client";
import * as serviceEvents from "./service.events";
const prisma = new PrismaClient()

export const groupsGetAll = async (id_event:number) =>{
  try {
    const groups = await prisma.eventGroup.findMany({
      where:{
        id_event
      }
    })
    return groups
  } catch (error) {
    return false;
  }

}
type GetGroupOne = {id:number,id_event?:number}
export const groupsGetById = async (filters:GetGroupOne) =>{
  try {
    const group = await prisma.eventGroup.findFirst({
      where:filters
    })
    return group
  } catch (error) {
    return false;
  }

}

type AddGroup = Prisma.Args<typeof prisma.eventGroup,'create'>['data']
export const groupsAdd = async (data:AddGroup) =>{
  try {
    if(!data.id_event) return false;

    const eventItem = await serviceEvents.eventsGetById(data.id_event)
    if(!eventItem) return false;
 
    const group = await prisma.eventGroup.create({
      data
    })
    return group
  } catch (error) {
    return false;
  }

}
type UpdateGroup = Prisma.Args<typeof prisma.eventGroup,'update'>['data'] & {id:number,id_event?:number}
export const groupsUpdate = async (data:UpdateGroup) =>{ 
  try {
    const group = await prisma.eventGroup.update({
      where:{
        id:data.id,
        id_event:data.id_event
      },
      data
    })
    return group
  } catch (error) {
    return false;
  }

}
type DeleteGroup = {id:number,id_event?:number}
export const groupsDelete = async (data:DeleteGroup) =>{
  try {
    const group = await prisma.eventGroup.delete({
      where:data
    })
    return group
  } catch (error) {
    return false;
  }

}