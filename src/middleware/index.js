import dbMiddleware from './db';
import nextConnect from 'next-connect';

const createHandler = (...middlewares) => {
  return nextConnect().use(dbMiddleware, ...middlewares);
};

export default createHandler;
