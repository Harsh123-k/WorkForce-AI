import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { Employee } from '../models/OrgModels';
import { AppError, asyncWrapper } from '../utils/errors';

const generateTokens = (user: any) => {
    const accessToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role, organizationId: user.organizationId },
        process.env.JWT_ACCESS_SECRET || 'super_secret_access_key_123!',
        { expiresIn: (process.env.JWT_ACCESS_EXPIRY || '15m') as any }
    );
    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key_456!',
        { expiresIn: (process.env.JWT_REFRESH_EXPIRY || '7d') as any }
    );
    return { accessToken, refreshToken };
};

export const register = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, role, organizationId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('Email address is already in use by another profile.', 400));
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        email,
        passwordHash,
        role,
        organizationId
    });

    const tokens = generateTokens(newUser);

    res.cookie('jwt_token', tokens.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.status(201).json({
        status: 'success',
        data: {
            user: { id: newUser._id, email: newUser.email, role: newUser.role },
            tokens
        }
    });
});

export const login = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError('Invalid email or password credentials.', 401));
    }

    // Check lock status
    if (user.isLocked && user.lockUntil && user.lockUntil > new Date()) {
        const remaining = Math.round((user.lockUntil.getTime() - new Date().getTime()) / 60000);
        return next(new AppError(`Account is temporarily locked. Try again in ${remaining} minutes.`, 403));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        user.failedLoginAttempts += 1;
        if (user.failedLoginAttempts >= 5) {
            user.isLocked = true;
            user.lockUntil = new Date(Date.now() + 60 * 60000); // Lock for 1 hour
            await user.save();
            return next(new AppError('Account locked due to 5 consecutive failed attempts. Try again in 1 hour.', 403));
        }
        await user.save();
        return next(new AppError(`Invalid credentials. Attempt ${user.failedLoginAttempts}/5 before locking.`, 401));
    }

    // Reset lock counters
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockUntil = undefined;
    await user.save();

    const tokens = generateTokens(user);

    res.cookie('jwt_token', tokens.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    // Fetch matching employee profile
    const employee = await Employee.findOne({ userId: user._id }).populate('departmentId');

    res.status(200).json({
        status: 'success',
        data: {
            user: { id: user._id, email: user.email, role: user.role },
            employee,
            tokens
        }
    });
});

export const refreshToken = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return next(new AppError('Refresh token is required to extend active session.', 400));
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key_456!') as any;
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new AppError('Target session user profile not found.', 401));
        }

        const tokens = generateTokens(user);
        res.status(200).json({
            status: 'success',
            data: tokens
        });
    } catch (err) {
        return next(new AppError('Invalid or expired refresh token. Please re-authenticate.', 401));
    }
});

export const logout = (req: Request, res: Response) => {
    res.clearCookie('jwt_token');
    res.status(200).json({
        status: 'success',
        message: 'Successfully logged out of the application.'
    });
};
