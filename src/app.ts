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

app.use('/',siteRouters)
app.use('/admin',adminRouters)

export default app;