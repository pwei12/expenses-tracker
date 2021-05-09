import { mount } from '@cypress/react';
import ExpensesList from '../../components/ExpensesList';

const expenses = [
  {
    amount: 10,
    date: new Date('2020, 12, 27'),
    category: 'Travel',
    notes: 'first item'
  },
  {
    amount: 50,
    date: new Date(),
    category: 'Food',
    notes: 'Second item'
  }
];

describe('<ExpensesList />', () => {
  beforeEach(() => {
    mount(<ExpensesList expenses={expenses} />);
  });

  it('renders title', () => {
    cy.findByText('Expenses').should('be.visible');
  });

  it('renders category of each item', () => {
    cy.findByText('[Travel] first item').should('be.visible');
    cy.findByText('[Food] Second item').should('be.visible');
  });

  it('renders edit icon for each item', () => {
    cy.findAllByLabelText('edit').should('have.lengthOf', expenses.length);
  });

  it('renders delete icon for each item', () => {
    cy.findAllByLabelText('delete').should('have.lengthOf', expenses.length);
  });

  it('renders date in the format of D MMM yyyy', () => {
    cy.findByText('27 Dec 2020').should('be.visible');
  });

  it('renders sum of expenses', () => {
    cy.findByText('60').should('be.visible');
  });
});

describe('<ExpensesList /> with empty data', () => {
  beforeEach(() => {
    mount(<ExpensesList expenses={[]} />);
  });

  it('renders "No Data"', () => {
    cy.findByText('No Data').should('be.visible');
  });

  it('renders no edit icon', () => {
    cy.findAllByLabelText('edit').should('have.lengthOf', 0);
  });

  it('renders no delete icon', () => {
    cy.findAllByLabelText('delete').should('have.lengthOf', 0);
  });
});
