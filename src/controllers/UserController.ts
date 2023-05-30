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
        this.router.post("/deposito", this.postDeposit.bind(this));
        this.router.post("/retiro", this.postRetiro.bind(this));
        this.router.get("/saldo", this.getBalance.bind(this));
        //Todas las rutas que necesite su controlador
    }

    private postDeposit(req: Request, res: Response) {
        try {
          const { accountId, montoDeposito } = req.body;
    
          // Consulta el saldo actual
          const account = db.User.find((account: any) => account.id === accountId);
          
          if (account) {
            const saldoActual = account.balance;
            const nuevoSaldo = saldoActual + montoDeposito;
            console.log("hola")
    
            // Actualiza el saldo de la cuenta en la base de datos simulada
            db.Account = db.Account.map((account: any) => {
              if (account.id === accountId) {
                return { ...account, balance: nuevoSaldo };
              }
              return account;
            });
    
            res.status(200).send({ mensaje: 'Depósito realizado exitosamente' });
          } else {
            res.status(404).send({ error: 'No se encontró la cuenta' });
          }
        } catch (error) {
          res.status(500).send({ error: 'Error al realizar el depósito' });
        }
    }
    
    private postRetiro(req: Request, res: Response) {
        try {
          const { accountId, montoRetiro } = req.body;
    
          // Consulta el saldo actual
          const rows = db.AccountUser.find((AccountUser: any) => AccountUser.id === accountId);
          
          if (rows) {
            const saldoActual = rows.balance;
            if (saldoActual >= montoRetiro) {
              const nuevoSaldo = saldoActual - montoRetiro;
    
              // Actualiza el saldo de la cuenta en la base de datos simulada
              db.Account = db.Account.map((account: any) => {
                if (account.id === accountId) {
                  return { ...account, balance: nuevoSaldo };
                }
                return account;
              });
    
              res.status(200).send({ mensaje: 'Retiro realizado exitosamente' });
            } else {
              res.status(400).send({ error: 'Saldo insuficiente' });
            }
          } else {
            res.status(404).send({ error: 'No se encontró la cuenta' });
          }
        } catch (error) {
          res.status(500).send({ error: 'Error al realizar el retiro' });
        }
    }

    private async getBalance(req: Request, res: Response) {
        try {
          const { email} = req.body;
      
          // Consulta el saldo actual
          const balances = await db.User.find((user: any) => user.email === email);
      
          if (balances) {
            const saldoActual = balances.balance;
            res.status(200).send({ saldo: saldoActual });
          } else {
            res.status(404).send({ error: 'No se encontró la cuenta' });
          }
        } catch (error) {
          res.status(500).send({ error: 'Error al consultar el saldo' });
        }
      }
      

}

export default UserController;
