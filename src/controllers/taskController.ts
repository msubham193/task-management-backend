import { Request, Response } from 'express';
import Task, { ITask } from '../models/Task';

import { IUser } from '../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, status, dueDate } = req.body;
        const task: ITask = new Task({
            title,
            description,
            status,
            user: req.user!.id,
            dueDate: dueDate ? new Date(dueDate) : undefined // Ensure dueDate is a Date object
        });
        await task.save();
        res.status(201).json({ status: 'success', task });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const tasks = await Task.find({ user: req.user!.id });
        res.status(200).json(tasks);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};


export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, status, dueDate } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, status, dueDate: dueDate ? new Date(dueDate) : undefined },
            { new: true }
        );
        if (!updatedTask) {
             res.status(404).json({ error: 'Task not found' });
             return;
        }
        res.status(200).json(updatedTask);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data =   await Task.findByIdAndDelete(id);
        res.status(204).json({
            status:true,
            data
        });
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
};
