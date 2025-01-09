// filepath: /c:/Users/marle/Desktop/ortal/Assigment2/src/routes/postRoutes.ts
import { Router } from 'express';
import {createPost, getPostById, getPosts, updatePost} from '../controller/postController';
import { authMiddleware } from '../controller/authController';

const router = Router();

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
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
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', createPost);

/**
 * @swagger
 * /post:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all posts
 *       400:
 *         description: Bad request
 */
router.get('/',authMiddleware, getPosts);

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post details
 *       404:
 *         description: Post not found
 */
router.get('/:id',authMiddleware, getPostById);

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     security: 
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
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
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 */
router.put('/:id',authMiddleware ,updatePost);

export default router;