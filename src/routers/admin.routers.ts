import {Router} from 'express';
import * as controllerAuth from '../controllers/controller.auth';
import {validadeLogin} from '../utils/middleware/validadeLoginMiddleware'

import * as controllerEvent from '../controllers/controller.events';
import * as controllerGroup from '../controllers/controller.groups';


const router = Router();

router.post('/login',controllerAuth.login);
// Rotas de eventos
router.get('/events',validadeLogin,controllerEvent.eventsGetAll);
router.get('/events/:id',validadeLogin,controllerEvent.eventsGetById);
router.post('/events',validadeLogin,controllerEvent.eventsAddEvent);
router.put('/events/:id',validadeLogin,controllerEvent.eventsUpdateEvent);
router.delete('/events/:id',validadeLogin,controllerEvent.eventsDeleteEvent);

// Rotas de Grupos
router.get('/events/:id_event/groups',validadeLogin,controllerGroup.groupsGetAll);





router.get('/ping',validadeLogin, (req, res) => {res.json({pong:true,admin:true});});



export default router;