import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors';

export interface IAuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
        organizationId?: string;
    };
}

export const protect = (req: IAuthRequest, res: Response, next: NextFunction) => {
    let token = '';

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // Check cookies
    else if (req.cookies && req.cookies.jwt_token) {
        token = req.cookies.jwt_token;
    }

    if (!token) {
        return next(new AppError('Not authenticated. Please log in to gain access.', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'super_secret_access_key_123!') as any;
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            organizationId: decoded.organizationId
        };
        next();
    } catch (error) {
        return next(new AppError('Invalid or expired authentication token.', 401));
    }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: IAuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError('User profile details not found in active session context.', 401));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError(`Access Denied: Role '${req.user.role}' does not possess required credentials.`, 403));
        }

        next();
    };
};
