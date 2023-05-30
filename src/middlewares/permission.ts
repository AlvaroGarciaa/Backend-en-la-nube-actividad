import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import db from '../models';

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
    if(req.headers.authorization){
      try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decodedJWT:any = jwt.decode(token, { complete: true });
        if (!decodedJWT) {
          res.status(401).send({ code: 'InvalidTokenException', message: 'The token is no valid' });
        }
        const userId = decodedJWT.payload.username;
        console.log(userId);
        // Fetch the user from the database
        const user = await db.Manager.findOne({
          where: {
            awsCognitoId: {userId}
          }
        });
  
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
    } else{
      res.status(401).send({'message': 'Missing token'});
    }
  }
}