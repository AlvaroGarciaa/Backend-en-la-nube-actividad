import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from '../models';

class UserController extends AbstractController {
    protected validateBody(type: any) {
        throw new Error("Method not implemented.");
    }
    //Singleton
    //Atributo de clase
    private static instance: UserController;
    //Método de clase
    public static getInstance(): AbstractController {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new UserController("cuenta");
        return this.instance;
    }
    protected initRoutes(): void {
        this.router.post("/deposito",this.authMiddleware.verifyToken, this.postDeposit.bind(this));
        this.router.post("/retiro",this.authMiddleware.verifyToken, this.postRetiro.bind(this));
        this.router.post("/saldo",this.authMiddleware.verifyToken, this.getBalance.bind(this));
        //Todas las rutas que necesite su controlador
    }

    private async postDeposit(req: Request, res: Response) {
        try {
          const { email, montoDeposito } = req.body;
            
          const user1 = await db.User.findOne({
            where: {
              email:email
            }
          })
          console.log(typeof user1.balance)
          console.log(typeof montoDeposito)
          const newBalance = parseInt(user1.balance) + montoDeposito;
          console.log(newBalance)
          // Consulta el saldo actual
          const user = await db.User.update(
            { balance: newBalance },
            { where: { email: email } }
          );
            res.status(200).send({ mensaje: 'Depósito realizado exitosamente' });
        } catch (error) {
          res.status(500).send({ error: 'Error al realizar el depósito' });
        }
    }
    
    private async postRetiro(req: Request, res: Response) {
        try {
            const { email, montoRetiro } = req.body;
      
            // Consulta el saldo actual
            const user1 = await db.User.findOne({
                where: {
                  email:email
                }
              });
              const newBalance = parseInt(user1.balance) - montoRetiro;
              console.log(newBalance)
            const user = db.User.update(
              { balance: newBalance },
              { where: { email: email } }
            );
              res.status(200).send({ mensaje: 'Retiro realizado exitosamente' });
          } catch (error) {
            res.status(500).send({ error: 'Error al realizar el retiro' });
          }
    }

    private async getBalance(req: Request, res: Response) {
        try {
          const {email} = req.body;
      
          // Consulta el saldo actual
          const user = await db.User.findOne({
            where: {
              email:email
            }
          });
          res.status(200).send(user.balance).end();
    
        } catch (error) {
          res.status(500).send({ error: 'Error al consultar el saldo' });
        }
      }
      

}

export default UserController;