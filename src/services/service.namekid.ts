import { PrismaClient,Prisma} from "@prisma/client"

const prisma = new PrismaClient()

//Buscar todos os nomes de crianças
export const getAllNameKidId = async (id_user:number) =>{
  try {
    // 1. Obter todos os NameKid
const nameKids = await prisma.nameKid.findMany({
  include: {
    User: true,
    VoteNameKid: true,
  },
});

// 2. Para cada NameKid, contar os votos true e false
const nameKidsWithVoteCounts = await Promise.all(
  nameKids.map(async (nameKid) => {
    const voteCounts = await prisma.voteNameKid.groupBy({
      by: ['vote'],
      where: {
        id_name: nameKid.id,
      },
      _count: {
        _all: true,
      },
    });

    const positiveVoteCount = voteCounts.find(v => v.vote === true)?._count._all || 0;
    const negativeVoteCount = voteCounts.find(v => v.vote === false)?._count._all || 0;
    const is_votede = nameKid.VoteNameKid.find(vote => vote.id_user === id_user);
    
    return {
      ...nameKid,
      positiveVoteCount,
      negativeVoteCount,
      is_voted: is_votede ? is_votede.vote : null,
    };
  })
);
  return nameKidsWithVoteCounts
  } catch (error) {
    console.log(error)
    return false
  }
  
}
// Buscar nome de criança por id
export const getNameKidById = async (id:number) =>{
  try {
    return await prisma.nameKid.findUnique({
      where:{id}, 
      include: {
      User: true,
    },})
  } catch (error) {
    return false
  }
}
// Buscar nome de criança por id
export const getAllNameKid = async () =>{
  try {
    return await prisma.nameKid.findMany({
      include: {
      User: true,
      VoteNameKid: true,
    },})
  } catch (error) {
    return false
  }
}

//Adicionar um nome de criança
type nameKidCreateData = Prisma.Args<typeof prisma.nameKid, 'create'>['data']

export const createNameKid = async (data: nameKidCreateData) =>{
  try {
    // data.id_user = id_user
    return await prisma.nameKid.create({data})
  } catch (error) {
    return false
  }
}

//Atualizar um nome de criança

type nameKidUpdateData = Prisma.Args<typeof prisma.nameKid, 'update'>['data']
export const updateNameKid = async (id:number, data:nameKidUpdateData) =>{
  try {
    return await prisma.nameKid.update({where:{id}, data})
  } catch (error) {
    return false
  }
}

//Deletar um nome de criança
export const deleteNameKid = async (id:number) =>{
  try {
    return await prisma.nameKid.delete({where:{id}})
  } catch (error) {
    return false
  }
}

//Vote namekid
export const voteNameKid = async (id_name:number, id_user:number, vote:boolean) =>{
  try {
    return await prisma.voteNameKid.create({data:{id_name, id_user, vote}})
  } catch (error) {
    console.log(error);
    return false
  }
}
export const getVoteNameKid = async (id_name:number, id_user:number) =>{
  try {
    return await prisma.voteNameKid.findFirst({where:{id_name, id_user}})
  } catch (error) {
    console.log(error);
    return false
  }
}
//Update vote namekid
export const updateVoteNameKid = async (id:number, vote:boolean) =>{
  try {
    return await prisma.voteNameKid.update({where:{id}, data:{vote}})
  } catch (error) {
    console.log(error);
    return false
  }
}