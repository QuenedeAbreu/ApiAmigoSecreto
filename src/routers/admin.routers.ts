import {Router} from 'express';
import * as controllerAuth from '../controllers/controller.auth';
import {validadeLogin} from '../utils/middleware/validadeLoginMiddleware'

import * as controllerEvent from '../controllers/controller.events';
const router = Router();

router.post('/login',controllerAuth.login);
router.get('/events',validadeLogin,controllerEvent.eventsGetAll);
router.get('/events/:id',validadeLogin,controllerEvent.eventsGetById);
router.post('/events',validadeLogin,controllerEvent.eventsAddEvent);
router.put('/events/:id',validadeLogin,controllerEvent.eventsUpdateEvent);
router.delete('/events/:id',validadeLogin,controllerEvent.eventsDeleteEvent);

router.get('/ping',validadeLogin, (req, res) => {res.json({pong:true,admin:true});});



export default router;