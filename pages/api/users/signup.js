import User from '@/models/user';
import createHanlder from '@/middleware';
import { COOKIE_NAME, COOKIE_AGE } from '@/constants/auth';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const handler = createHanlder();

handler.post(async (req, res) => {
  const { userName, email, password, confirmedPassword } = req.body;
  const incompleteData = !(userName && email && password && confirmedPassword);
  if (incompleteData) {
    return res.status(400).json({ success: false, reason: 'Incomplete field' });
  }

  if (password !== confirmedPassword) {
    return res
      .status(400)
      .json({ success: false, reason: 'Passwords are not identical' });
  }

  const userFound = await User.findOne({ email }).exec();
  if (userFound) {
    return res
      .status(403)
      .json({ success: false, reason: 'Email has been registered' });
  }

  await User.create(req.body, async (err, user) => {
    if (!user) {
      return res
        .status(403)
        .json({ success: false, reason: 'Failed to create account' });
    }

    if (!err) {
      try {
        const isPasswordValid = await user.verifyPassword(password);
        if (!isPasswordValid) {
          return res
            .status(500)
            .json({ success: false, reason: 'Invalid password' });
        }

        const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: '7d'
        });

        res.status(201).setHeader(
          'Set-Cookie',
          serialize(COOKIE_NAME, token, {
            path: '/',
            httpOnly: true,
            maxAge: COOKIE_AGE,
            sameSite: 'strict',
            secure: true
          })
        );
        res.send({ success: true });
      } catch (error) {
        await User.deleteOne({ email }).exec();
        res
          .status(500)
          .json({ success: false, reason: 'Password verification error' });
      }
    } else {
      await User.deleteOne({ email }).exec();
      res.status(500).json({ success: false, reason: 'Unexpected error' });
    }
  });
});

export default handler;
