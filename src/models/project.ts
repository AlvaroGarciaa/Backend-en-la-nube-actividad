'use strict';

import {Model} from 'sequelize';

interface AccountAttributes{
  id:number,
  balance: number,  
}

module.exports = (sequelize:any, DataTypes:any) => {
  class Account extends Model<AccountAttributes> implements AccountAttributes {
    id!:number;
    balance!:number;
    static associate(models:any) {
      // define association here
      Account.belongsToMany(models.User,{
        through:'AccountUser'
      })
    }
  }
  Account.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    balance:{
        type:DataTypes.DECIMAL(10,2)  ,
        allowNull:false
    },
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};