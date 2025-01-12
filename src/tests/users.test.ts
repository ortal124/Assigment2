import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import userService from '../services/userService';
import initApp from '../index';
import { IUser } from '../models/userModel';

let app: Express;

type User = IUser & {
    accessToken?: string;
    refreshToken?: string;
};

let testUser: User = {
    email: 'testUser@user.com',
    password: 'testpassword',
};

describe('User Routes', () => {
    let userId = '';
    let usersToDelete: string[] = [];

    beforeAll(async () => {
        app = await initApp();
        const user = await userService.createUser({
            email: testUser.email,
            password: testUser.password,
        });
        userId = user.id;
        usersToDelete.push(userId);

        const loginResponse = await request(app)
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password });

        testUser.accessToken = loginResponse.body.accessToken;
        testUser.refreshToken = loginResponse.body.refreshToken;
    });

    afterAll(async () => {
        if (usersToDelete.length) {
            usersToDelete.forEach(async (id) => {
                await userService.deleteUser(id);
            });
            await userService.deleteUser(userId);
        }
        mongoose.connection.close();
    });

    describe('POST /users/register', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/users/register')
                .send({
                    username: 'newUser',
                    email: 'newUser@user.com',
                    password: 'newpassword',
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id');
            usersToDelete.push(response.body._id);
        });

        it('should return 400 for invalid request', async () => {
            const response = await request(app)
                .post('/users/register')
                .send({
                    username: '',
                    email: 'invalidEmail',
                    password: '',
                });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /users/:id', () => {
        it('should get a user by ID successfully', async () => {
            const response = await request(app)
                .get(`/users/${userId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', userId);
        });

        it('should return 404 for non-existent user', async () => {
            const response = await request(app)
                .get(`/users/677ecc104cab6c6247a7741d`)
                .set('Authorization', `Bearer ${testUser.accessToken}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /users/:id', () => {
        it('should update a user by ID successfully', async () => {
            const response = await request(app)
                .put(`/users/${userId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .send({
                    username: 'updatedUser',
                    email: 'updatedUser@user.com',
                    password: 'updatedpassword',
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('email', 'updatedUser@user.com');
        });

        it('should return 404 for non-existent user', async () => {
            const response = await request(app)
                .put('/users/677ecc104cab6c6247a7741d')
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .send({
                    username: 'updatedUser',
                    email: 'updatedUser@user.com',
                    password: 'updatedpassword',
                });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete a user by ID successfully', async () => {
            const response = await request(app)
                .delete(`/users/${userId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`);

            expect(response.status).toBe(200);

            const index: number = usersToDelete.indexOf(userId);
            if (index !== -1) {
                usersToDelete.splice(index, 1);
            }

        });

        it('should return 404 for non-existent user', async () => {
            const response = await request(app)
                .delete('/users/677ecc104cab6c6247a7741d')
                .set('Authorization', `Bearer ${testUser.accessToken}`);

            expect(response.status).toBe(404);
        });
    });
});