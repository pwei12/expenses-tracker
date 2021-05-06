import mongoose from 'mongoose';

export const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return;

  const dbConnection = await mongoose.connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
  });

  return dbConnection;
};

export const jsonSerialize = object => {
  return JSON.parse(JSON.stringify(object));
};

export default async function dbMiddleware(_req, _res, next) {
  try {
    if (!global.mongoose) {
      global.mongoose === dbConnect();
    }
  } catch (error) {
    console.errro(error);
  }
  return next();
}
