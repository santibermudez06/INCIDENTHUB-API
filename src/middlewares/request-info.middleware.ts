import { Request, Response, NextFunction } from 'express';

export const requestInfoMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  (req as any).requestInfo = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path
  };
  next();
};