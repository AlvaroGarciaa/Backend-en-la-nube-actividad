import { Request, Response } from "express";
import AbstractController from "./AbstractController";

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
        this.router.get("/cuenta/deposito", this.postDeposit.bind(this));
        this.router.get("/cuenta/retiro", this.postWithdraw.bind(this));
        this.router.post("/cuenta/saldo", this.getBalance.bind(this));
        //Todas las rutas que necesite su controlador
    }
    private postDeposit(req: Request, res: Response) {
        res.status(200).send("servicio de lectura de usuarios");
    }
    private postWithdraw(req: Request, res: Response) {
        res.status(200).send("Alta usuario");
    }

    private getBalance(req: Request, res: Response) {
        res.status(200).send("Alta usuario");
    }
}

export default UserController;
