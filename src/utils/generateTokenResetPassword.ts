import crypto from "crypto"

type Props ={
  resettoken:string
  expiresToken:any 
}

export const generateTokenResetPassword = (): Props => {
  const resettoken = crypto.randomBytes(20).toString('hex');

  const now = new Date();
  now.setHours(now.getHours() + 2); // Adiciona duas horas

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Meses começam de 0 em JavaScript
  const day = String(now.getDate()).padStart(2, '0');
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  const expiresToken = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}z`;

  return { resettoken, expiresToken };
};