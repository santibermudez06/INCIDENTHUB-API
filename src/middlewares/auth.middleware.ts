import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(401, 'Unauthorized: Missing or invalid token format');
  }

  const token = authHeader.split(' ')[1];

  if (token !== 'instructor-token' && token !== 'technician-token') {
    throw new AppError(401, 'Unauthorized: Invalid token');
  }

  (req as any).user = {
    role: token === 'instructor-token' ? 'admin' : 'technician'
  };

  next();
};