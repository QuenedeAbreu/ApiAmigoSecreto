import app from './app';
import 'dotenv/config';
import https from 'https';
import http from 'http';



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
}else{
  const serverPort:number = process.env.PORT ? parseInt(process.env.PORT):9000;
  runServer(serverPort, regularServer);
}