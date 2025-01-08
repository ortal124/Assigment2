// filepath: /c:/Users/marle/Desktop/ortal/Assigment2/src/routes/commentRoutes.ts
import { Router } from 'express';
import {createComment, deleteComment, getAllComments, getCommentsByPostId, updateComment} from '../controller/commentController';
import { authMiddleware } from '../controller/authController';

const router = Router();

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               senderId:
 *                 type: string
 *               postId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, createComment);

/**
 * @swagger
 * /comment:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: List of all comments
 *       400:
 *         description: Bad request
 */
router.get('/', authMiddleware, getAllComments);

/**
 * @swagger
 * /comment/{post}:
 *   get:
 *     summary: Get a comments by post ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: post's Comment details
 *       404:
 *         description: post not found
 */
router.get('/:post',authMiddleware ,getCommentsByPostId);

/**
 * @swagger
 * /comment/{commentId}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               senderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       404:
 *         description: Comment not found
 */
router.put('/:commentId',authMiddleware ,updateComment);

/**
 * @swagger
 * /comment/{commentId}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 */
router.delete('/:commentId', authMiddleware, deleteComment);

export default router;