import { Response, Request, NextFunction } from 'express';
import Manager from '../models/';

export default class PermissionMiddleware {
  // Singleton
  private static instance: PermissionMiddleware;
  public static getInstance(): PermissionMiddleware {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new PermissionMiddleware();
    return this.instance;
  }

  /**
   * Verify that the current user is an Agent
   */
  public async checkIsAgent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user; // Assuming you have a middleware that sets the user object on the request

      // Fetch the user from the database
      const user = await Manager.findByPk(userId);

      if (!user) {
        res.status(401).send({ 'message': 'User not found' });
        return;
      }

      if (user.role !== 'AGENT') {
        res.status(403).send({ 'message': 'User is not an agent' });
        return;
      }

      // User is an agent, allow the request to proceed
      next();
    } catch (error) {
      console.error('Error in checkIsAgent middleware:', error);
      res.status(500).send({ 'message': 'Internal server error' });
    }
  }
}