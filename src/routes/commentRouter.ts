import express from 'express';
import * as commentController from '../controller/commentController';

const router = express.Router();

router.post('/', commentController.createComment);
router.put('/:commentId', commentController.updateComment);
router.get('/', commentController.getAllComments);
router.get('/post', commentController.getCommentsByPostId);
router.delete('/:commentId', commentController.deleteComment);

export default router;