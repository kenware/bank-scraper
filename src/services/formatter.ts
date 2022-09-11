import XLSX from "xlsx";
import logger from '../utils/logger';
import { IAuth } from 'src/utils/interfaces/auth';
import { IAccount } from 'src/utils/interfaces/account';
import { ICustomer } from 'src/utils/interfaces/customer';
import { getWorkbook  } from "../utils/processWorkbook";

export default class Fommatter {
    /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   */
  static Auth(data: any): IAuth {
    try{
      const auth = {
        email: data.email,
        phone: data.phone,
        bvn: data.bvn
      }
      return auth
    }catch(err: any) {
      logger.info(err)
      throw err
    }
  }

  /**
  * @param {object} ctx
  * @param {req} ctx.request
  * @param {res} ctx.response
  */
  static Customer(data: any): ICustomer {
    try{
      const customer = {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
      }
      return customer

    }catch(err: any) {
      logger.info(err)
      throw err
    }
  }

  /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   */
    static AccountTransaction(data: any): Array<IAccount>{
    try{
      return data.accounts.map((account: any) => {
        return {
            accountType: account.type,
            bankName: data.bankName,
            balance: Number(account.amount?.replace(/[^0-9,.]+/g, "")),
            ledgerBalance: Number(account.ledgerAamount?.replace(/[^0-9,.]+/g, "")),
            accountNumber: account.accountNumber,
            transactions: account.transactions.map(item => {
              return {...item, amount: Number(item.amount?.replace(/[^0-9,.]+/g, "")),}
            })
        }
      })
    }catch(err: any) {
      console.log(err)
      logger.info(err)
      throw err
    }
  }

  /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   */
  static formatData(data: any, save=true): any {
    try{
        const auth = Fommatter.Auth(data)
        const customer = Fommatter.Customer(data)
        const accounts = Fommatter.AccountTransaction(data)
        const formattedData =  {
            auth, customer, accounts
        }
        const newAccount = accounts.map(item => {return {...item, uniqueAuthId: auth.email} })

        let workbook
 
        if(save){
          workbook = getWorkbook([auth], [{...customer, uniqueAuthId: auth.email}], newAccount);
          XLSX.writeFile(workbook, `formatted-data-${new Date()}.xlsx`)
        }
        return { formattedData, workbook};
    }catch(err) {
      const errMessage = err.message || "Error Occured";
      logger.info(errMessage);
      return err
    }
  }
}

