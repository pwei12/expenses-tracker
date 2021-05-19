import moment from 'moment-timezone';
import { EXPENSE_CATEGORIES } from '../constants/expense';

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

export const sortExpensesByDate = (expenses, order = 'desc') => {
  const orderValue = order === 'asc' ? 1 : -1;
  return [...expenses].sort((first, second) => {
    if (first.date === second.date) {
      return 0;
    } else {
      return moment(first.date).isAfter(second.date)
        ? orderValue
        : -1 * orderValue;
    }
  });
};

export const filterByCategory = (expenseItems, category) => {
  const filteredByCategory = expenseItems.filter(
    expenseItem => expenseItem.category === category
  );
  return filteredByCategory;
};

export const formatExpensesForDisplayByCategory = expenseItems => {
  return EXPENSE_CATEGORIES.reduce((result, expenseCategory) => {
    const expenseItemsFilteredByCategory = filterByCategory(
      sortExpensesByDate(expenseItems),
      expenseCategory
    );
    const toShowExpenseItemsFilteredByCategory =
      expenseItemsFilteredByCategory.length > 0;
    return toShowExpenseItemsFilteredByCategory
      ? {
          ...result,
          [expenseCategory]: expenseItemsFilteredByCategory
        }
      : result;
  }, {});
};

export const formatExpensesForDisplayByMonth = expenseItems => {
  return expenseItems.reduce((result, expenseItem) => {
    const monthAndYear = moment(expenseItem.date).format('MMM yyyy');
    const doesMonthAndYearExist = monthAndYear in result;

    if (doesMonthAndYearExist) {
      result[monthAndYear].push(expenseItem);
    }

    return doesMonthAndYearExist
      ? {
          ...result,
          [monthAndYear]: sortExpensesByDate(result[monthAndYear])
        }
      : {
          ...result,
          [monthAndYear]: [expenseItem]
        };
  }, {});
};
