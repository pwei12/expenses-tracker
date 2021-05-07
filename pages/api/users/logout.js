import createHanlder from '@/middleware';
import { COOKIE_NAME } from '@/constants/auth';
import { serialize } from 'cookie';

const handler = createHanlder();

handler.post(async (req, res) => {
  res.status(201).setHeader(
    'Set-Cookie',
    serialize(COOKIE_NAME, '', {
      path: '/',
      httpOnly: true,
      maxAge: -1,
      sameSite: 'strict',
      secure: true
    })
  );
  res.send({ success: true });
});

export default handler;
