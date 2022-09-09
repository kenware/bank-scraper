import mongoose from 'mongoose';
import normalize from 'normalize-mongoose';
import baseSchema from './base';

const { Schema } = mongoose;

const TransactionSchema = new Schema({
  type: {type: String, required: true},
  clearedDate: { type: Date, required: true, default: Date.now },
  amount: {type: Number, required: true},
  description: String,
  senderAccountNumber: Number, // required if account type is credit
  beneficiaryAccountNumber: Number, // required if account type is debit
  account: { type: mongoose.Types.ObjectId, ref: "okraAccount", required: false },
});

TransactionSchema.add(baseSchema);
TransactionSchema.plugin(normalize);

export const TransactionModel = mongoose.model('okraAccountTransaction', TransactionSchema);
