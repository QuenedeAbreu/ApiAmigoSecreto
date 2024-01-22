// import app from './app';
import 'dotenv/config';
import https from 'https';
import http from 'http';

import express from 'express';
import cors from 'cors';
import siteRouters from './routers/site.routers';
import adminRouters from './routers/admin.routers';
import {requestIntercepter} from './utils/middleware/requestIntercepter';



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
//middleware
app.all('*',requestIntercepter)

app.use('/api',siteRouters)
app.use('/api/admin',adminRouters)


const runServer = (port:number, server: http.Server) =>{
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  
    server.on('error', (error) => {
      console.error(error);
    
      server.close();
      process.exit(1);
    })
  })
}

const regularServer = http.createServer(app);
if(process.env.NODE_ENV === 'production'){
    //Configurar SSL
    //Rodar server na 80 e na 443
    runServer(3000, regularServer);
}else{
  const serverPort:number = process.env.PORT ? parseInt(process.env.PORT):9000;
  runServer(serverPort, regularServer);
}