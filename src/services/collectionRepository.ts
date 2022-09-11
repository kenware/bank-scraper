import logger from '../utils/logger';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import { IAuth } from '../utils/interfaces/auth';
import { IAccount } from '../utils/interfaces/account';
import { ICustomer } from '../utils/interfaces/customer';

import { AuthModel } from '../models/auth';
import { AccountModel } from '../models/account';
import { CustomerModel } from '../models/customer';
import { TransactionModel } from '../models/transaction';

export default class CollectionRepository {
    /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   */
  static async auth(data: IAuth, password: string): Promise<any> {
    try{
      return await AuthModel.create({
        ...data,
        password: bcrypt.hashSync(password, 10)
      })
    }catch(err: any) {
      logger.info(err)
      throw err?.message || err
    }
  }

  /**
  * @param {object} ctx
  * @param {req} ctx.request
  * @param {res} ctx.response
  */
  static async customer(data: ICustomer, authId: mongoose.Types.ObjectId): Promise<any> {
    try{
      return await CustomerModel.create({
        ...data,
        auth: authId
      })
    }catch(err: any) {
      logger.info(err)
      throw err?.message || err
    }
  }

  /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   */
    static async accountTransaction(dataList: Array<IAccount>, authId: mongoose.Types.ObjectId): Promise<any>{
    try{
      const data = []
      for (const item of dataList){
        const accountData = {...item}
        delete accountData.transactions
        accountData.auth = authId
        const account = await AccountModel.create(accountData)
        const transactionData = item.transactions.map(item => {
          return{
            type: item.type,
            clearedDate: item.clearedDate,
            amount: item.amount,
            description: item.description,
            senderAccountNumber: item.type === 'credit' ? item.sender : '',
            beneficiaryAccountNumber: item.type === 'debit' ? item.sender : '',
            account: account._id
          }
        })
        const transactions = await TransactionModel.insertMany(transactionData)
        data.push({account, transactions})
      }
      return data
    }catch(err: any) {
      console.log(err)
      logger.info(err)
    }
  }

  /**
  * @param {object} ctx
  * @param {req} ctx.request
  * @param {res} ctx.response
  */
   static async saveALL(data: any, password: string): Promise<any> {
    try{
      const auth = await CollectionRepository.auth(data.auth, password)
      if(auth) {
        await CollectionRepository.customer(data.customer, auth._id)
        await CollectionRepository.accountTransaction(data.accounts, auth._id)
      }else{
        logger.info('AUth not found')
      }
      return true
    }catch(err: any) {
      logger.info(err?.message)
      throw err?.message || err
    }
  }
}
