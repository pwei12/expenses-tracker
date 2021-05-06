import User from '@/models/user';
import createHanlder from '@/middleware';

const handler = createHanlder();

handler.get(async (_req, res) => {
  const users = await User.find({}).exec();
  res.status(200).json(users);
});

handler.post(async (req, res) => {
  try {
    await User.create(
      {
        ...req.body
      },
      async (err, user) => {
        if (!err) {
          try {
            const isPasswordValid = await user.verifyPassword(
              req.body.password
            );
            if (!isPasswordValid) throw new Error('Invalid password');
            return res.status(201).json({ success: true, data: user });
          } catch (error) {
            throw new Error(error);
          }
        }
      }
    );
  } catch (error) {
    res.status(400).json({ success: false });
  }
});

export default handler;
