import { PrismaClient, Prisma } from "@prisma/client"
import * as servicePeople from './service.people'
import * as serviceGroups from './service.groups'
import * as utils from '../utils/match'

const prisma = new PrismaClient()

export const eventsGetAll = async (id_user: number,contains?:string,take?:number,skip?:number) => {
  try {
    const [events,countEvents] = await prisma.$transaction([
      prisma.event.findMany({
      where: { 
        id_user: id_user,
        title:{
          contains
        }},
        take,
        skip
    }),

    prisma.event.count({
      where:{
        id_user,
        title:{
          contains
        }
      }
    })
    ])
    return {events,countEvents}
  } catch (error) {
    return false;
  }
}

export const eventsGetById = async (id: number) => {
  try {
    return await prisma.event.findFirst({ where: { id } })
  } catch (error) {
    return false;
  }
}

type EventCreateData = Prisma.Args<typeof prisma.event, 'create'>['data']
export const eventAdd = async (id_user:number,data: EventCreateData) => {
  try {
    data.id_user = id_user
    return prisma.event.create({
      data
    })
  } catch (error) {
    return false
  }
}

type EventUpdateData = Prisma.Args<typeof prisma.event, 'update'>['data']
export const eventUpdate = async (id: number, data: EventUpdateData) => {
  try {
    return prisma.event.update({
      where: { id },
      data
    })
  } catch (error) {
    return false
  }

}

export const eventDelete = async (id: number) => {
  try {
    return await prisma.event.delete({ where: { id } })
  } catch (error) {
    return false
  }
}

export const doMatch = async (id: number): Promise<boolean> => {
  const eventItem = await prisma.event.findFirst({ where: { id }, select: { grouped: true } });
  if (eventItem) {
    const peopleList = await servicePeople.peopleGetAll({ id_event: id });
    
    if (peopleList) {
      let sortedList: { id: number, matech: number }[] = []
      let sortable: number[] = []
      let attempts = 0;
      let maxAttempts = peopleList.length;
      let keepTrying = true;
      while (keepTrying && attempts < maxAttempts) {
        keepTrying = false;
        attempts++;
        sortedList=[]
        sortable = peopleList.map(item =>item.id);

        for(let i in peopleList){
          let sortableFiltered: number[] = sortable;
          
          if(eventItem.grouped === true){

            sortableFiltered = sortable.filter(sortableItem=>{
              let sortablePerson = peopleList.find(item => item.id === sortableItem);
              return peopleList[i].id_group !== sortablePerson?.id_group;

            })
          }
          
          if(sortableFiltered.length === 0 || (sortableFiltered.length === 1 && peopleList[i].id === sortableFiltered[0])){
           keepTrying = true;
           
          }else{
            let sortedIndex = Math.floor(Math.random() * sortableFiltered.length);
            while(sortableFiltered[sortedIndex] === peopleList[i].id){
              sortedIndex = Math.floor(Math.random() * sortableFiltered.length);
            }
           
            sortedList.push({
              id:peopleList[i].id,
              matech:sortableFiltered[sortedIndex]
            });
            sortable = sortable.filter(item => item !== sortableFiltered[sortedIndex])

          }
        }
      }
      if (attempts < maxAttempts) {
        for (let i in sortedList) {
          await servicePeople.peopleUpdate({
            id: sortedList[i].id,
            id_event: id,
            matched: utils.encryptMatch(sortedList[i].matech)
          })
        }
        return true;
      }
    }
  }


  return false;
}

