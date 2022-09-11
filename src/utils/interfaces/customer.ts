import mongoose from "mongoose";

export interface ICustomer {
    firstName?: string,
    lastName?: string,
    address?: string,
    auth?: mongoose.Types.ObjectId,
  }
