'use strict';

import { Model } from 'sequelize';

interface ManagerAttributes{
    awsCognitoId: string, 
    name: string, 
    email: string, 
    role: string
}

export enum UserRoles{
    ADMIN = 'ADMIN',
    SUPERVISOR = "SUPERVISOR",
    AGENT = "AGENT",
    CUSTOMER = "CUSTOMER"
  }

module.exports = (sequelize:any, DataTypes:any) => {

    class Manager extends Model<ManagerAttributes> implements ManagerAttributes {
        awsCognitoId!: string;
        name!: string;
        email!: string;
        role!: string;
    }

    Manager.init({
        awsCognitoId: {
            type:DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        name: DataTypes.STRING, 
        email: DataTypes.STRING, 
        role: {
            type: DataTypes.STRING, 
            allowNull: false, 
            defaultValue: UserRoles.AGENT
        },
    }, {
        sequelize,
        modelName: 'Agent',
    });

    return Manager;
}