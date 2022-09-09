import mongoose from 'mongoose';
import normalize from 'normalize-mongoose';
import baseSchema from './base';

const { Schema } = mongoose;

const CustomerSchema = new Schema({
  firstName: String,
  lastName: String,
  address: String,
  auth: { type: mongoose.Types.ObjectId, ref: "okraAuth", required: false },
});

CustomerSchema.add(baseSchema);
CustomerSchema.plugin(normalize);

export const CustomerModel = mongoose.model('okraCustomerProfile', CustomerSchema);
