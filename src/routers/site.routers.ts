import {Router} from 'express';
import * as eventController from '../controllers/controller.events';
import * as peopleController from '../controllers/controller.people';
const router = Router();

router.get('/events/:id',eventController.eventsGetById);
router.get('/events/:id_event/search',peopleController.peopleSearch);




router.get('/ping', (req, res) => {
    res.json('pong');

})

export default router;