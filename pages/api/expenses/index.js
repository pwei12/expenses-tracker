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
  } catch {
    res.status(500).json({ success: false, reason: 'Unexpected error' });
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
  } catch {
    res.status(500).json({ success: false, reason: 'Unexpected error' });
  }
});

handler.put(async (req, res) => {
  try {
    const { id, ...payload } = req.body;
    const expenseUpdated = await Expense.findByIdAndUpdate(id, payload, {
      new: true
    });
    if (!expenseUpdated) {
      return res
        .status(403)
        .json({ success: false, reason: 'Failed to update expense' });
    }
    res.status(200).json({ success: true, data: expenseUpdated });
  } catch {
    res.status(500).json({ success: false, reason: 'Unexpected error' });
  }
});

handler.delete(async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.body.id, (error, expenseDeleted) => {
      if (error) {
        return res
          .status(500)
          .json({ success: false, reason: 'Unexpected error' });
      }
      if (!expenseDeleted) {
        return res
          .status(404)
          .json({ success: false, reason: 'Expenses item does not exist' });
      }
      res.status(200).json({ success: true, id: expenseDeleted._id });
    });
  } catch {
    res.status(500).json({ success: false, reason: 'Unexpected error' });
  }
});

export default handler;
