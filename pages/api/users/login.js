import User from '@/models/user';
import createHanlder from '@/middleware';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME, COOKIE_AGE } from '@/constants/auth';
import { serialize } from 'cookie';

const handler = createHanlder();

handler.post(async (req, res) => {
  const { email, password } = req.body;
  const incompleteData = !(email && password);
  if (incompleteData) {
    return res.status(400).json({ success: false, reason: 'Incomplete field' });
  }

  await User.findOne({ email }, async (err, user) => {
    if (!user) {
      return res.status(403).json({ success: false, reason: 'User not found' });
    }

    if (!err) {
      try {
        const isPasswordValid = await user.verifyPassword(password);
        if (!isPasswordValid) {
          res.status(500).json({ success: false, reason: 'Invalid password' });
        }
        const token = await jwt.sign(
          { id: user.id, userName: user.userName },
          process.env.JWT_SECRET,
          {
            expiresIn: '7d'
          }
        );
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
        res
          .status(500)
          .json({ success: false, reason: 'Password verification error' });
      }
    } else {
      res.status(500).json({ success: false, reason: 'Unexpected error' });
    }
  }).exec();
});

export default handler;
