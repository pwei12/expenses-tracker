import mongoose from 'mongoose';
import mongooseBcrypt from 'mongoose-bcrypt';

const MODEL_NAME = 'User';

const userSchema = new mongoose.Schema(
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
    }
  },
  { timestamps: true }
);

userSchema.plugin(mongooseBcrypt);

export default mongoose.models[MODEL_NAME] ||
  mongoose.model(MODEL_NAME, userSchema);
