import mongoose, { Schema } from 'mongoose';
import mongooseBcrypt from 'mongoose-bcrypt';
import { EXPENSE_MODEL_NAME, USER_MODEL_NAME } from '@/constants/model';

const userSchema = new Schema(
  {
    userName: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    expenses: [
      {
        type: Schema.Types.ObjectId,
        ref: EXPENSE_MODEL_NAME
      }
    ]
  },
  { timestamps: true }
);

userSchema.plugin(mongooseBcrypt);

export default mongoose.models[USER_MODEL_NAME] ||
  mongoose.model(USER_MODEL_NAME, userSchema);
