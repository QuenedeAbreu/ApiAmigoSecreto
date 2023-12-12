import {Router} from 'express';
import * as controllerAuth from '../controllers/controller.auth';
import {validadeLogin} from '../utils/middleware/validadeLoginMiddleware'
const router = Router();

router.get('/ping',validadeLogin, (req, res) => {res.json({pong:true,admin:true});});
router.post('/login',controllerAuth.login);



export default router;