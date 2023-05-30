import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import mysql, { RowDataPacket } from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'tu_usuario',
    password: 'tu_contraseña',
    database: 'tu_base_de_datos',
  });

class UserController extends AbstractController{
    
    protected validateBody(type: any) {
        throw new Error("Method not implemented.");
    }
    //Singleton
    //Atributo de clase
    private static instance:UserController;
    //Método de clase
    public static getInstance():AbstractController{
        if(this.instance){
            return this.instance;
        }
        this.instance = new UserController('user');
        return this.instance;
    }
    protected initRoutes(): void {
        this.router.post('/cuenta/deposito', this.cuentaDeposito.bind(this));
        this.router.post('/cuenta/retiro',this.realizarRetiro.bind(this));
        this.router.get('/cuenta/saldo',this.consultarSaldo.bind(this));
    }


    private getReadUsers(req:Request,res:Response){
        res.status(200).send("servicio de lectura de usuarios");
    }
    private postCreateUser(req:Request,res:Response){
        res.status(200).send("Alta usuario");
    }

    async realizarRetiro(req: Request, res: Response): Promise<void> {
        try {
          const { accountId, montoRetiro } = req.body;
      
          // Consulta el saldo actual
          const [rows] = await connection.execute<RowDataPacket[]>('SELECT balance FROM Account WHERE id = ?', [accountId]);
      
          if (rows.length > 0) {
            const saldoActual = rows[0].balance;
            if (saldoActual >= montoRetiro) {
              const nuevoSaldo = saldoActual - montoRetiro;
      
              // Actualiza el saldo de la cuenta en la base de datos
              await connection.execute('UPDATE Account SET balance = ? WHERE id = ?', [nuevoSaldo, accountId]);
      
              res.status(200).json({ mensaje: 'Retiro realizado exitosamente' });
            } else {
              res.status(400).json({ error: 'Saldo insuficiente para realizar el retiro' });
            }
          } else {
            res.status(404).json({ error: 'No se encontró la cuenta' });
          }
        } catch (error) {
          res.status(500).json({ error: 'Error al realizar el retiro' });
        }
      }
      
    async consultarSaldo(req: Request, res: Response): Promise<void> {
        try {
          const { accountId } = req.query; // Suponiendo que el ID de la cuenta se envía como un parámetro de consulta
      
          // Realiza la consulta para obtener el saldo
          const [rows] = await connection.execute<RowDataPacket[]>('SELECT balance FROM Account WHERE id = ?', [accountId]);
      
          if (rows.length > 0) {
            const saldo = rows[0].balance;
      
            res.status(200).json({ saldo });
          } else {
            res.status(404).json({ error: 'No se encontró la cuenta' });
          }
        } catch (error) {
          res.status(500).json({ error: 'Error al consultar el saldo' });
        }
      }
      
    async cuentaDeposito(req: Request, res: Response): Promise<void> {
        try {
          const { accountId, montoDeposito } = req.body;
      
          // Llama a la función actualizarBalanceCuenta
          await this.actualizarBalanceCuenta(accountId, montoDeposito);
      
          res.status(200).json({ message: 'Depósito realizado' });
        } catch (error) {
          res.status(500).json({ error: 'Error' });
        }
      }

      async actualizarBalanceCuenta(accountId: number, montoDeposito: number): Promise<void> {
        try {
          const [rows] = await connection.execute<RowDataPacket[]>('SELECT balance FROM Account WHERE id = ?', [accountId]);
          const balanceActual = rows[0]?.balance;
      
          if (typeof balanceActual === 'number') {
            const nuevoBalance = balanceActual + montoDeposito;
      
            await connection.execute('UPDATE Account SET balance = ? WHERE id = ?', [nuevoBalance, accountId]);
      
            console.log('Balance actualizado correctamente');
          } else {
            console.error('No se encontró la cuenta o el balance no es un número');
          }

          //cerrar la conexion despues de usarse
          await connection.end();
        } catch (error) {
          console.error('Error al actualizar el balance:', error);
        }
      }
      
}

export default UserController;