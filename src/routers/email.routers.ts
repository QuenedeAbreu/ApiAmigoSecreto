import {Router} from 'express';
import * as controllerEmail from '../controllers/constroller.email'
import {validadeLogin} from '../utils/middleware/validadeLoginMiddleware'

const router = Router()


router.post('/sendemail/:id',validadeLogin,controllerEmail.SendEmail)





export default router;