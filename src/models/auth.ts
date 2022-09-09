import mongoose from 'mongoose';
import normalize from 'normalize-mongoose';
import baseSchema from './base';

const { Schema } = mongoose;

const AuthSchema = new Schema({
  phone: { type: String, trim: true },
  email: {
    type: String, lowercase: true,
    trim: true,
  },
  bvn: { type: String, trim: true },
  password: { type: String, select: false },
});

AuthSchema.add(baseSchema);

AuthSchema.virtual('customerProfile', {
    ref: 'okraCustomerProfile',
    localField: '_id',
    foreignField: 'auth'
});

AuthSchema.plugin(normalize);

export const AuthModel = mongoose.model('okraAuth', AuthSchema);
