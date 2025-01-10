import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import initApp from '../index';
import { IUser } from '../models/userModel';
import { IComment } from '../models/commentModel';
import { IPost } from '../models/postModel';
import userService from '../services/userService';
import * as postService from '../services/postService';
import { deleteComment } from '../services/commentService';

let app: Express;

type User = IUser & {
    accessToken?: string;
    refreshToken?: string;
};

let testUser: User = {
    email: 'testcomments@user.com',
    password: 'testpassword',
};

let testPost: IPost = {
    content: 'postContent',
    senderId: '',
};

let testComment: IComment = {
    content: 'This is a test comment',
    senderId: '',
    postId: '',
};

describe('Comment Routes', () => {
    let userId = '';
    let commentId = '';

    beforeAll(async () => {
        app = await initApp();
        const user = await userService.createUser({ email: testUser.email, password: testUser.password });
        userId = user.id;
        testComment.senderId = userId;
        testPost.senderId = userId;

        const post = await postService.createPost(testPost.content, testPost.senderId);
        testComment.postId = post.id;

        const loginResponse = await request(app)
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password });

        testUser.accessToken = loginResponse.body.accessToken;
        testUser.refreshToken = loginResponse.body.refreshToken;
    });

    afterAll(async () => {
        if (userId) {
            await userService.deleteUser(userId);
        }
        if (commentId) {
            await deleteComment(commentId);
        }
        mongoose.connection.close();
    });

    describe('POST /comment', () => {
        it('should create a new comment', async () => {
            const response = await request(app)
                .post('/comment')
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .send(testComment);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            commentId = response.body._id;
        });

        it('should return 400 for invalid request', async () => {
            const response = await request(app)
                .post('/comment')
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .send({});

            expect(response.status).toBe(400);
        });
    });

    describe('GET /comment', () => {
        it('should get all comments', async () => {
            const response = await request(app)
                .get('/comment')
                .set('Authorization', `Bearer ${testUser.accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('GET /comment/:post', () => {
        it('should get comments by post ID', async () => {
            const response = await request(app)
                .get(`/comment/${testComment.postId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });

        it('should return 404 for non-existent post ID', async () => {
            const response = await request(app)
                .get('/comment/7780f69f47d16a210a79b6ed')
                .set('Authorization', `Bearer ${testUser.accessToken}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /comment/:commentId', () => {
        it('should update a comment by ID', async () => {
            const response = await request(app)
                .put(`/comment/${commentId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .send({ content: 'Updated comment content', senderId: userId });

            expect(response.status).toBe(201);
        });
        
        it('should return 400 for rquest without senderId', async () => {
            const response = await request(app)
                .put(`/comment/${commentId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .send({ content: 'Updated comment content'});

            expect(response.status).toBe(400);
        });

        it('should return 400 for rquest without content', async () => {
            const response = await request(app)
                .put(`/comment/${commentId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .send({ senderId: userId});

            expect(response.status).toBe(400);
        });

        it('should return 404 for non-existent comment ID', async () => {
            const response = await request(app)
                .put('/comment/nonExistentCommentId')
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .send({ content: 'Updated comment content', senderId: userId});

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /comment/:commentId', () => {
        it('should delete a comment by ID', async () => {
            const response = await request(app)
                .delete(`/comment/${commentId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`);

            expect(response.status).toBe(200);
        });

        it('should return 404 for non-existent comment ID', async () => {
            const response = await request(app)
                .delete('/comment/nonExistentCommentId')
                .set('Authorization', `Bearer ${testUser.accessToken}`);

            expect(response.status).toBe(404);
        });
    });
});