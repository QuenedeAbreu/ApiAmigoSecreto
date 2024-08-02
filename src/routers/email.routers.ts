import {Router} from 'express';
import * as controllerEmail from '../controllers/constroller.email'
import {validadeLogin} from '../utils/middleware/validadeLoginMiddleware'

const router = Router()


router.post('/resetpassword/:id_user',validadeLogin,controllerEmail.SendEmailResetPassword)





export default router;