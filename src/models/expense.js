import mongoose, { Schema } from 'mongoose';
import { EXPENSE_CATEGORIES } from '@/constants/expense';
import { EXPENSE_MODEL_NAME, USER_MODEL_NAME } from '@/constants/model';

const expenseSchema = new Schema(
  {
    amount: {
      type: Number,
      trim: true,
      required: true
    },
    category: {
      type: String,
      enum: EXPENSE_CATEGORIES,
      default: EXPENSE_CATEGORIES[0],
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
      trim: true
    },
    notes: {
      type: String,
      default: '',
      trim: true
    },
    user: { type: Schema.Types.ObjectId, ref: USER_MODEL_NAME }
  },
  { timestamps: true }
);

export default mongoose.models[EXPENSE_MODEL_NAME] ||
  mongoose.model(EXPENSE_MODEL_NAME, expenseSchema);
