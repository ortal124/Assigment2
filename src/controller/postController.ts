import { Request, Response } from 'express';
import * as postService from '../services/postService';

export const createPost = async (req: Request, res: Response) => {
    try {
        const { content, senderId } = req.body;
        const newPost = await postService.createPost(content, senderId);
        res.status(201).json(newPost);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: 'Error creating post', error: err.message });
    }
};

export const getPosts = async (req: Request, res: Response) => {
    const { sender } = req.query;
    try {
        let posts;
        if (sender) {
            posts = await postService.getPostsBySender(sender as string);
        } else {
            posts = await postService.getPosts();
        }
        res.status(200).json(posts);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId;
        const post = await postService.getPostById(postId);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
        } else{
            res.status(200).json(post);
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: 'Error fetching post', error: err.message });
    }
};

export const updatePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId;
        const { content, senderId } = req.body;
        if (!content || !senderId) {
            res.status(400).json({ message: 'Content and sender are required for update' });
        } else{
            const updatedPost = await postService.updatePost(postId, content, senderId);
            res.json(updatedPost);
        }
    } catch (error) {
        const err = error as Error;
        res.status(404).json({ message: 'Error updating post', error: err.message });
    }
};