import { Request, Response } from 'express';
import * as commentService from '../services/commentService';
import * as postService from '../services/postService';

export const createComment = async (req: Request, res: Response) => {
    try {
        const { content, senderId, postId } = req.body;
        if (!content || !senderId || !postId) {
            res.status(400).json({ message: 'Content, sender and post are required for comment creation' });
        } else {
            const newComment = await commentService.createComment(content, senderId, postId);
            res.status(201).json(newComment);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error creating comment', error: (error as any).message });
    }
};

export const updateComment = async (req: Request, res: Response) => {
    try {
        const commentId = req.params.commentId;
        const { content, senderId } = req.body;
        if (!content || !senderId) {
            res.status(400).json({ message: 'Content and sender are required for update' });
        } else{
            const updatedComment = await commentService.updateComment(commentId, content, senderId);
            res.status(201).json(updatedComment);
        }
    } catch (error) {
        res.status(404).json({ message: 'Error comment not found with this ID', error: (error as any).message });
    }
};

export const getAllComments = async (req: Request, res: Response) => {
    try {
        const comments = await commentService.getAllComments();
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error: (error as any).message });
    }
};

export const getCommentsByPostId = async (req: Request, res: Response) => {
    try {
        const postId = req.params.post as string;
        const post = await postService.getPostById(postId);
            if (post == null) {
                res.status(404).json({ message: 'Post not found' });
            } else{
                const comments = await commentService.getCommentsByPostId(postId);
                res.json(comments);
            }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments by post id', error: (error as any).message });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const commentId = req.params.commentId;
        await commentService.deleteComment(commentId);
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(404).json({ message: 'Error comment not found with this ID', error: (error as any).message });
    }
};