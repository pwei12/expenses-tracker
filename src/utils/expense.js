import moment from 'moment-timezone';

export const formatDateForDisplay = date => {
  return moment.tz(moment(date).utc(), moment.tz.guess()).format('D MMM yyyy');
};

export const formatDateToBeSaved = date => {
  return moment.tz(date.utc(), moment.tz.guess());
};

export const sumUpExpenses = expenses => {
  return expenses.reduce(
    (total, expense) => Math.round(total * 100 + expense.amount * 100) / 100,
    0
  );
};

export const sortExpensesByDate = (expenses, order) => {
  const orderValue = order === 'asc' ? 1 : -1;
  return expenses.sort((first, second) => {
    if (first.date === second.date) {
      return 0;
    } else {
      return moment(first.date).isAfter(second.date)
        ? orderValue
        : -1 * orderValue;
    }
  });
};
