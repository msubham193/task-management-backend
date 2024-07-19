import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description?: string;
    status: string;
    user: mongoose.Schema.Types.ObjectId;
}

const taskSchema: Schema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
