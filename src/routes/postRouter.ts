import express from 'express';
import * as postController from '../controller/postController';

const router = express.Router();

router.post('/', postController.createPost);
router.get('/', postController.getPosts);
router.get('/:postId', postController.getPostById);
router.put('/:postId', postController.updatePost);

export default router;