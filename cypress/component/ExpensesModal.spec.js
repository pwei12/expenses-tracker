import { mount } from '@cypress/react';
import ExpensesModal from '../../components/ExpensesModal';
import moment from 'moment-timezone';

describe('<ExpensesModal />', () => {
  beforeEach(() => {
    mount(<ExpensesModal isVisible={true} />);
  });

  it('renders labels of different fields', () => {
    cy.findByTitle('Amount').should('be.visible');
    cy.findByTitle('Category').should('be.visible');
    cy.findByTitle('Date').should('be.visible');
    cy.findByTitle('Notes').should('be.visible');
  });

  it('should allow to key in amount', () => {
    cy.findByLabelText('Amount').type(10).should('have.value', 10);
  });

  it('renders default Date as the date of today', () => {
    cy.findByLabelText('Date').should(
      'have.value',
      moment().format('yyyy-MM-DD')
    );
  });

  it('should allow to key in notes', () => {
    cy.findByLabelText('Notes').type('Hello').should('have.value', 'Hello');
  });
});
