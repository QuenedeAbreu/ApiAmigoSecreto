import { RequestHandler } from "express";
import { z } from "zod";

import * as servicesEmail from "../services/service.email";

//Enviar email
export const SendEmail:RequestHandler = async (req,res) =>{
  const emailSchema = z.object({
    to: z.string().email(),
    subject: z.string(),
    context:z.object({
      title: z.string(),
      message: z.string()})

  })
  const {to,subject,context} = emailSchema.parse(req.body)
  const sendEmail = await servicesEmail.sendEmail(to,subject,context)
  if(sendEmail) return res.status(200).json({message:"Email enviado com sucesso!"})
  res.status(500).json({message:"Internal Server Error"})
}