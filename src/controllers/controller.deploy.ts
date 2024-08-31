import { RequestHandler } from "express";
import 'dotenv/config';

export const deploy:RequestHandler = (req,res)=>{
  const tokendeploy = req.params.tokendeploy;
 // http://168.75.100.166:3000/api/box/deploy/4983edd12231c72823d7f54948c8903f62a0ea79ea99c351
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


