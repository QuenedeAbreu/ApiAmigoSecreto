import { getToday } from "../utils/getToday"


export const validadePassword = (password:string ):boolean =>{
  const currentPassword = getToday().split('/').join('')
  return password === currentPassword
}

export const createToken = () =>{
  const currentPassword = getToday().split('/').join('')
  return `${process.env.DEFAULT_TOKEN}${currentPassword}`
}

export const validadeToken = (token: string) =>{
  const currentToken = createToken()
  console.log(token);
  return token === `${currentToken}`
}