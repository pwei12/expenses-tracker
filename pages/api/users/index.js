import User from '@/models/user';
import createHanlder from '@/middleware';

const handler = createHanlder();

handler.get(async (_req, res) => {
  const users = await User.find({}).exec();
  res.status(200).json(users);
});

export default handler;
