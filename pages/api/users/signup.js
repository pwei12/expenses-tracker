import User from '@/models/user';
import createHanlder from '@/middleware';

const handler = createHanlder();

handler.post(async (req, res) => {
  const { userName, email, password, confirmedPassword } = req.body;
  const incompleteData = !(userName && email, password, confirmedPassword);
  if (incompleteData) {
    return res.status(400).json('Incomplete field.');
  }

  if (password !== confirmedPassword) {
    return res.status(400).json('Passwords are not identical.');
  }

  const userFound = await User.findOne({ email }).exec();
  if (userFound) {
    return res
      .status(403)
      .json({ success: false, reason: 'email already registered' });
  }

  await User.create(
    {
      ...req.body
    },
    async (err, user) => {
      if (!err) {
        try {
          const isPasswordValid = await user.verifyPassword(req.body.password);
          if (!isPasswordValid) throw new Error('Invalid password');
          res.status(201).json({ success: true, data: user });
        } catch {
          res.status(500).json({ success: false, reason: 'unknown' });
        }
      } else {
        res.status(500).json({ success: false });
      }
    }
  );
});

export default handler;
