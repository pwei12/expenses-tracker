import mongoose from 'mongoose';
import { EXPENSE_CATEGORIES } from '@/constants/expense';

const MODEL_NAME = 'Expense';

const expenseSchema = new mongoose.Schema(
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
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.models[MODEL_NAME] ||
  mongoose.model(MODEL_NAME, expenseSchema);
