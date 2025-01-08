import { Router } from 'express';
import userController from '../controller/userController';

const router = Router();

router.post("/register", userController.register);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router