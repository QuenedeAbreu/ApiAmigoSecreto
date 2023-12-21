import {Router} from 'express';
import * as controllerAuth from '../controllers/controller.auth';
import {validadeLogin} from '../utils/middleware/validadeLoginMiddleware'

import * as controllerEvent from '../controllers/controller.events';
import * as controllerGroup from '../controllers/controller.groups';
import * as controllerPeople from '../controllers/controller.people';




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
router.get('/events/:id_event/groups/:id',validadeLogin,controllerGroup.groupsGetById);
router.post('/events/:id_event/groups',validadeLogin,controllerGroup.groupsAdd);
router.put('/events/:id_event/groups/:id',validadeLogin,controllerGroup.groupsUpdate);
router.delete('/events/:id_event/groups/:id',validadeLogin,controllerGroup.groupsDelete);

// Rotas de pessoas
router.get('/events/:id_event/groups/:id_group/people',validadeLogin,controllerPeople.peopleGetAll);
router.get('/events/:id_event/groups/:id_group/people/:id',validadeLogin,controllerPeople.peopleGetById);
router.post('/events/:id_event/groups/:id_group/people',validadeLogin,controllerPeople.peopleAdd);
router.put('/events/:id_event/groups/:id_group/people/:id',validadeLogin,controllerPeople.peopleUpdate);
router.delete('/events/:id_event/groups/:id_group/people/:id',validadeLogin,controllerPeople.peopleDelete);






router.get('/ping',validadeLogin, (req, res) => {res.json({pong:true,admin:true});});



export default router;