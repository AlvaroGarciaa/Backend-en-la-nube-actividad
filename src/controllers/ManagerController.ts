import { Request, Response } from 'express';
import AbstractController from './AbstractController';
import db from '../models';


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
        this.router.get("/consultarCuentas", this.authMiddleware.verifyToken,this.permissionMiddleware.checkIsAgent ,this.getAccounts.bind(this));
        this.router.post("/segmentacion",this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsAgent, this.getSegmentation.bind(this));
    }

    private async getAccounts(req: Request, res: Response){
        try{
            const accounts = await db.User.findAll();

            return res.status(200).send({'accounts': accounts});
        }catch(error){
            return res.status(500).send({'error': error});
        }
    }

    private async getSegmentation(req: Request, res: Response){
        try{
            const {minBalance, maxBalance} = req.body;

            if(!minBalance || !maxBalance)
                return res.status(400).send({'error': 'Missing info'})

            const accounts = await db.User.findAll({
                where:{
                    balance: {
                        [db.Sequelize.Op.between]: [minBalance, maxBalance],
                    },
                },
            });
            return res.status(200).send({'accounts': accounts});
        }catch(error){
            return res.status(500).send({'error': error})
        }
    }
}

export default ManagerController;