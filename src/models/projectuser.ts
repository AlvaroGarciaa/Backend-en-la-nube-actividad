'use strict';

import {Model} from 'sequelize';

interface ProjectUserAttributes{
  AccountId:number,
  UserId:string,
  Balance:number  
}

module.exports = (sequelize:any, DataTypes:any) => {
  class AccountUser extends Model<ProjectUserAttributes> implements ProjectUserAttributes {
    AccountId!: number;
    UserId!: string;
    Balance!: number;
  }
  AccountUser.init({
    AccountId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        references:{
            model:'Account',
            key:'id'
        }
    },
    UserId:{
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true,
        references:{
            model:'User',
            key:'awsCognitoId'
        }
    },
    Balance:DataTypes.DECIMAL(10,2)    
  }, {
    sequelize,
    modelName: 'AccountUser',
  });
  return AccountUser;
};