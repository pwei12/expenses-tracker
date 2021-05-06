import mongoose from 'mongoose';

const MODEL_NAME = 'User';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true
    },
    lastName: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      index: { unique: true },
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.models[MODEL_NAME] ||
  mongoose.model(MODEL_NAME, userSchema);
