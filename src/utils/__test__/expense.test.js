import {
  filterByCategory,
  sumUpExpenses,
  sortExpensesByDate,
  formatExpensesForDisplayByCategory,
  formatExpensesForDisplayByMonth
} from '../expense';

const expenseItems = [
  {
    amount: 12.08,
    date: '2020-12-31T05:00:18.848Z',
    category: 'Other'
  },
  {
    amount: 10.02,
    date: '2021-01-01T05:27:18.848Z',
    category: 'Travel'
  },
  {
    amount: 8.01,
    date: '2021-01-15T05:27:18.848Z',
    category: 'Travel'
  }
];

describe('sumUpExpenses utils function', () => {
  it('should return total expenses of a given array of expense item objects', () => {
    expect(sumUpExpenses(expenseItems)).toBe(30.11);
  });
});

describe('sortExpensesByDate utils function', () => {
  it('should return a sorted array of expense item objects by date in ascending order', () => {
    const expenseItemsSortedByAscendingDate = [
      {
        amount: 12.08,
        date: '2020-12-31T05:00:18.848Z',
        category: 'Other'
      },
      {
        amount: 10.02,
        date: '2021-01-01T05:27:18.848Z',
        category: 'Travel'
      },
      {
        amount: 8.01,
        date: '2021-01-15T05:27:18.848Z',
        category: 'Travel'
      }
    ];
    expect(sortExpensesByDate(expenseItems, 'asc')).toEqual(
      expenseItemsSortedByAscendingDate
    );
  });

  it('should return a sorted array of expense item objects by date in descending order by default', () => {
    const expenseItemsSortedByAscendingDate = [
      {
        amount: 8.01,
        date: '2021-01-15T05:27:18.848Z',
        category: 'Travel'
      },
      {
        amount: 10.02,
        date: '2021-01-01T05:27:18.848Z',
        category: 'Travel'
      },
      {
        amount: 12.08,
        date: '2020-12-31T05:00:18.848Z',
        category: 'Other'
      }
    ];
    expect(sortExpensesByDate(expenseItems)).toEqual(
      expenseItemsSortedByAscendingDate
    );
  });
});

describe('filterByCategory', () => {
  it('should return an array of expense items of category "Travel"', () => {
    const expenseItemsOfCategoryTravel = [...expenseItems];
    expenseItemsOfCategoryTravel.shift();
    expect(filterByCategory(expenseItems, 'Travel')).toEqual(
      expenseItemsOfCategoryTravel
    );
  });
});

describe('formatExpensesForDisplayByCategory', () => {
  it('should return an object with category as the key and an array of expense items sorted in descending order of date as the value', () => {
    const expectedResult = {
      Other: [
        {
          amount: 12.08,
          date: '2020-12-31T05:00:18.848Z',
          category: 'Other'
        }
      ],
      Travel: [
        {
          amount: 8.01,
          date: '2021-01-15T05:27:18.848Z',
          category: 'Travel'
        },
        {
          amount: 10.02,
          date: '2021-01-01T05:27:18.848Z',
          category: 'Travel'
        }
      ]
    };
    expect(formatExpensesForDisplayByCategory(expenseItems)).toEqual(
      expectedResult
    );
  });
});

describe('formatExpensesForDisplayByMonth', () => {
  it('should return an object with monthAndYear as the key and an array of expense items sorted in descending order of date as the value', () => {
    const expectedResult = {
      'Jan 2021': [
        {
          amount: 8.01,
          date: '2021-01-15T05:27:18.848Z',
          category: 'Travel'
        },
        {
          amount: 10.02,
          date: '2021-01-01T05:27:18.848Z',
          category: 'Travel'
        }
      ],
      'Dec 2020': [
        {
          amount: 12.08,
          date: '2020-12-31T05:00:18.848Z',
          category: 'Other'
        }
      ]
    };
    expect(formatExpensesForDisplayByMonth(expenseItems)).toEqual(
      expectedResult
    );
  });
});
