import { Request, Response } from 'express';
import userService from '../services/userService';

const register = async (req: Request, res: Response) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
};

const getUser = async (req: Request, res: Response) => {
    try {
        const user = await userService.getUser(req.params.id);
        if (!user) {
            res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        if (!user) {
            res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        if (!user) {
            res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(400).send(err);
    }
};

export default {
    register,
    getUser,
    updateUser,
    deleteUser,
};