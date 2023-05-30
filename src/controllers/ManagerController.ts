import { Request, Response } from 'express';
import AbstractController from './AbstractController';


class ManagerController extends AbstractController{
    protected validateBody(type: any) {
        throw new Error("Method not implemented");
    }

    private static instance: ManagerController;

    public static getInstance(): AbstractController{
        if(this.instance){
            return this.instance
        }
        this.instance = new ManagerController("agente");
        return this.instance;
    }

    protected initRoutes(): void {
        this.router.get("/consultarCuentas", this.getAccounts.bind(this));
        this.router.get("/segmentacion", this.getSegmentation.bind(this));
    }

    private getAccounts(req: Request, res: Response){
        res.status(200).send("Todas las cuentas alv");
    }

    private getSegmentation(req: Request, res: Response){
        res.status(200).send("Cuentas segmentadas alv");
    }
}

export default ManagerController;