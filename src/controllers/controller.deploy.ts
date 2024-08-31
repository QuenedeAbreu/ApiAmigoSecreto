import { RequestHandler } from "express";
import 'dotenv/config';

export const deploy:RequestHandler = (req,res)=>{
  const tokendeploy = req.params.tokendeploy;
 try {
  fetch(process.env.ROUTER_DEPLOY  as string + tokendeploy, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return res.status(200).send('Deployment started');
  } catch (error) {
    console.log(error)
    return res.status(500).send('Deploy error');
  } 

} 


