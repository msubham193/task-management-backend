import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description?: string;
    status: 'todo' | 'inprogress' | 'done';
    user: mongoose.Schema.Types.ObjectId;
    dueDate?: Date;  // Add dueDate field
}

const taskSchema: Schema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['todo', 'inprogress', 'done'], 
        default: 'todo' 
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dueDate: { type: Date }  // Add dueDate field
}, { timestamps: true });

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
