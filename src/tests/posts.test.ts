import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import initApp from '../index';
import { IUser } from '../models/userModel';
import { IPost } from '../models/postModel';
import userService from '../services/userService';
import * as postService from '../services/postService';

let app: Express;

type User = IUser & {
    accessToken?: string;
    refreshToken?: string;
};

let testUser: User = {
    email: 'testposts@user.com',
    password: 'testpassword',
};

let testPost: IPost = {
    content: 'This is a test post',
    senderId: '',
};

describe('Post Routes', () => {
    let userId = '';
    let postId = '';

    beforeAll(async () => {
        app = await initApp();
        const user = await userService.createUser({ email: testUser.email, password: testUser.password });
        userId = user.id;
        testPost.senderId = userId;

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
        mongoose.connection.close();
    });

    describe('POST /post', () => {
        it('should create a new post', async () => {
            const response = await request(app)
                .post('/post')
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .send(testPost);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            postId = response.body._id;
        });

        it('should return 500 for invalid request', async () => {
            const response = await request(app)
                .post('/post')
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .send({});

            expect(response.status).toBe(500);
        });
    });

    describe('GET /post', () => {
        it('should get all posts', async () => {
            const response = await request(app)
                .get('/post')
                .set('Authorization', `Bearer ${testUser.accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('GET /post/:id', () => {
        it('should get a post by ID', async () => {
            const response = await request(app)
                .get(`/post/${postId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', postId);
        });

        it('should return 404 for non-existent post ID', async () => {
            const nonExistentPostId = new mongoose.Types.ObjectId().toString();
            const response = await request(app)
                .get(`/post/${nonExistentPostId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`);
        
            expect(response.status).toBe(404);
        });
    });

    describe('PUT /post/:id', () => {
        it('should update a post by ID', async () => {
            const response = await request(app)
                .put(`/post/${postId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .send({ content: 'Updated post content', senderId: userId });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('content', 'Updated post content');
        });

        it('should return 400 for invalid request', async () => {
            const response = await request(app)
                .put(`/post/${postId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .send({ content: '' });

            expect(response.status).toBe(400);
        });

        it('should return 404 for non-existent post ID', async () => {
            const response = await request(app)
                .put('/post/nonExistentPostId')
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .send({ content: 'Updated post content', senderId: userId });

            expect(response.status).toBe(404);
        });
    });
});