import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Development vs Production error logging
    if (process.env.NODE_ENV === 'development') {
        console.error('API Error logs:', err);
        return res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
            stack: err.stack
        });
    }

    // Operational expected errors vs system errors
    if (err.isOperational) {
        return res.status(statusCode).json({
            status: 'fail',
            message
        });
    }

    // System bug fallback
    console.error('System Critical Error:', err);
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong inside the server infrastructure.'
    });
};
