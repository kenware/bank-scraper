import mongoose from "mongoose";

export interface IAccount {
    firstName?: string,
    lastName?: string,
    address?: string,
    auth?: mongoose.Types.ObjectId,
    accountType: string,
    bankName: string,
    balance: number,
    ledgerBalance: number
    accountNumber: number,
    transactions: Array<any>
  }
