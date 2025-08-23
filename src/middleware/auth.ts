import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const isAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

export const isNotAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.status(400).json({ error: 'Already authenticated' });
};
