import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    role: 'Super Admin' | 'Organization Admin' | 'HR Manager' | 'Manager' | 'Team Lead' | 'Employee' | 'Finance' | 'IT Administrator' | 'Auditor';
    organizationId?: mongoose.Types.ObjectId;
    isLocked: boolean;
    failedLoginAttempts: number;
    lockUntil?: Date;
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { 
        type: String, 
        required: true, 
        enum: ['Super Admin', 'Organization Admin', 'HR Manager', 'Manager', 'Team Lead', 'Employee', 'Finance', 'IT Administrator', 'Auditor'],
        default: 'Employee'
    },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    isLocked: { type: Boolean, default: false },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date }
}, { timestamps: true });

UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);
