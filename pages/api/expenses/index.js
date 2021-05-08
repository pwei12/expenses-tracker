import Expense from '@/models/expense';
import createHanlder from '@/middleware';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

const handler = createHanlder();

handler.get(async (req, res) => {
  try {
    const cookies = parse(req.headers.cookie ?? '');
    const userId = jwt.verify(cookies.access_token, process.env.JWT_SECRET).id;
    const expenses = await Expense.find({ user: userId }).exec();

    if (!expenses) {
      return res.status(404).json({ success: true, data: {} });
    }
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, reason: error });
  }
});

handler.post(async (req, res) => {
  try {
    const cookies = parse(req.headers.cookie ?? '');
    const userId = jwt.verify(cookies.access_token, process.env.JWT_SECRET).id;
    const expenseCreated = await Expense.create({
      ...req.body,
      user: userId
    });
    if (!expenseCreated) {
      return res
        .status(403)
        .json({ success: false, reason: 'Failed to add expense' });
    }
    res.status(200).json({ success: true, data: expenseCreated });
  } catch (error) {
    res.status(500).json({ success: false, reason: error });
  }
});

export default handler;
