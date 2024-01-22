import app from './app';
import 'dotenv/config';
import https from 'https';
import http from 'http';
import fs from 'fs';

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
  const options ={
    key:fs.readdirSync(process.env.SSL_KEY as string),
    cert:fs.readFileSync(process.env.SSL_CERT as string)
  }
  const secServer = https.createServer(options, app);
  runServer(80, regularServer);
  runServer(443, secServer);
        
}else{
  const serverPort:number = process.env.PORT ? parseInt(process.env.PORT):9000;
  runServer(serverPort, regularServer);
}