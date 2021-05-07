import Expense from '@/models/expense';
import createHanlder from '@/middleware';

const handler = createHanlder();

handler.get(async (_req, res) => {
  try {
    const expenses = await Expense.find({}).exec();
    if (!expenses) {
      console.log('NO EXPENSES! FOUND! SO RETURN EMPTY');
      res.status(404).json({ success: true, data: {} });
    }
    console.log('expenses in handler', expenses);
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    console.log('CANNOT FIND EXPENSE', error);
    res.status(500).json({ success: false, reason: error });
  }
});

handler.post(async (req, res) => {
  try {
    console.log('req body', req.body);
    const expenseCreated = await Expense.create({
      ...req.body
    });
    if (!expenseCreated) {
      console.log('NO EXPENSES! CREATED! SO RETURN EMPTY');
      return res
        .status(403)
        .json({ success: false, reason: 'Failed to add expense' });
    }
    console.log('expenses created', expenseCreated);
    res.status(200).json({ success: true, data: expenseCreated });
  } catch (error) {
    console.log('FAILED TO  add EXPENSE', error);
    res.status(500).json({ success: false, reason: error });
  }
});

export default handler;
