import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    googleId?: string;
    comparePassword: (password: string) => Promise<boolean>;
}

const userSchema: Schema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname:{ type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        
        required: function() { return !this.googleId; },
    },
    googleId: { type: String }
});

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
     
    return await bcrypt.compare(password, this.password,);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
