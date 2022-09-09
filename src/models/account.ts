import mongoose from 'mongoose';
import normalize from 'normalize-mongoose';
import baseSchema from './base';

const { Schema } = mongoose;

const AccountSchema = new Schema({
  accountType: {type: String, required: true},
  bankName: {type: String, required: true},
  balance: {type: Number, default: 0.00},
  ledgerBalance: {type: Number, default: 0.00},
  accountNumber: {type: Number, required: true},
  auth: { type: mongoose.Types.ObjectId, ref: "okraAuth", required: false },
});

AccountSchema.add(baseSchema);
AccountSchema.plugin(normalize);

export const AccountModel = mongoose.model('okraAccount', AccountSchema);
