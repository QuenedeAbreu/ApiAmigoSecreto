import {Router} from 'express';
import * as controllerAuth from '../controllers/controller.auth';
import {validadeLogin} from '../utils/middleware/validadeLoginMiddleware'

import * as controllerEvent from '../controllers/controller.events';
import * as controllerGroup from '../controllers/controller.groups';
import * as controllerPeople from '../controllers/controller.people';

// Rota de nomes de crianças
import * as controllerNamekid from '../controllers/controller.namekid';

//Rota de Deploy
import * as controllerDeploy from '../controllers/controller.deploy'


const router = Router();
//Rotas de nomes de crianças
router.get('/namekid', validadeLogin,controllerNamekid.NamekidGetAll)
router.get('/namekid/vote/:id_user', validadeLogin,controllerNamekid.NamekidGetAllIdVote)
router.get('/namekid/:id', validadeLogin, controllerNamekid.NamekidGetById)
router.post('/namekid/user/:id_user', validadeLogin, controllerNamekid.NamekidAdd)
router.put('/namekid/:id/user/:id_user', validadeLogin, controllerNamekid.NamekidUpdate)
router.delete('/namekid/:id/user/:id_user', validadeLogin, controllerNamekid.NamekidDelete)
// Rotas vote nome de crianças 
router.post('/namekid/vote/:id_name/user/:id_user', validadeLogin, controllerNamekid.NamekidVote)


//Rotas usuario
router.get('/verifyexistsuser',controllerAuth.verifyExistsUser)
router.post('/firstregister',controllerAuth.UserAddFirst)

router.post('/register',validadeLogin,controllerAuth.UserAdd);
router.get('/user',validadeLogin,controllerAuth.UserGetAll);
router.get('/user/:id',validadeLogin,controllerAuth.UserGetById);
router.put('/user/:id',validadeLogin,controllerAuth.UserUpdate);
router.put('/user/:id/status',validadeLogin,controllerAuth.UserUpdateStatus);

//Login 
router.post('/logintokenname/:tokenname',controllerAuth.loginFromTokenName)
router.post('/login',controllerAuth.login);

// Reset password 
router.post('/user/forgotpassword/:id_user',validadeLogin,controllerAuth.SendEmailForgotPassword)
router.post('/user/resetpassword/:reset_token',controllerAuth.ResetPassword)




// Rotas de eventos
router.get('/events/user/:id_user',validadeLogin,controllerEvent.eventsGetAll);
router.get('/events/:id',validadeLogin,controllerEvent.eventsGetById);
router.post('/events/user/:id_user',validadeLogin,controllerEvent.eventsAddEvent);
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



// router.get('/isTokenValid',validadeLogin, (req, res) => {
//   res.json({isTokenValid:true,admin:true});
// });
router.get('/isTokenValid',validadeLogin,controllerAuth.isTokenvalid);

// deploy
router.post('/deploy/:tokendeploy',controllerDeploy.deploy);


export default router;