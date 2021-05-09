import { HTTP_POST_METHOD } from '../../../src/constants/http';

const ROOT = 'http://localhost:3000';
const LOGIN_PAGE = `${ROOT}/login`;
const LOGIN_ENDPOINT = `${ROOT}/api/users/login`;

describe('Login page', () => {
  beforeEach(() => {
    cy.visit(LOGIN_PAGE);
  });

  class LoginPage {
    get emailInput() {
      return cy.getByLabel('Email');
    }
    get passwordInput() {
      return cy.getByLabel('Password');
    }
    clickSubmitButton() {
      return cy.get('button[type=submit]').contains('Submit').click();
    }
  }

  const loginPage = new LoginPage();

  it('should show success message when login successfully', () => {
    cy.intercept(HTTP_POST_METHOD, LOGIN_ENDPOINT, { success: true });
    loginPage.emailInput.type('abc@email.com');
    loginPage.passwordInput.type('abc123');
    loginPage.clickSubmitButton();
    cy.get('span').should('contain.text', 'Login successfully');
  });

  it('should show error message when login failed', () => {
    cy.intercept(HTTP_POST_METHOD, LOGIN_ENDPOINT, {
      success: false,
      reason: 'Login failed'
    });
    loginPage.emailInput.type('abc@email.com');
    loginPage.passwordInput.type('abc123');
    loginPage.clickSubmitButton();
    cy.get('span').should('contain.text', 'Login failed');
  });

  it('should fail to submit login form when email is not keyed in', () => {
    loginPage.passwordInput.type('abc123');
    loginPage.clickSubmitButton();
    cy.get('div[role=alert]').should('contain.text', 'Email is required');
  });

  it('should fail to submit login form when password is not keyed in', () => {
    loginPage.emailInput.type('abc@email.com');
    loginPage.clickSubmitButton();
    cy.get('div[role=alert]').should(
      'contain.text',
      'Password must be at least 6 characters'
    );
  });

  it('should fail to submit login form when email is of invalid format', () => {
    loginPage.emailInput.type('abc@emailcom');
    loginPage.passwordInput.type('abc123');
    loginPage.clickSubmitButton();
    cy.get('div[role=alert]').should('contain.text', 'Email is invalid');
  });

  it('should fail to submit login form when password is less than 6 characters', () => {
    loginPage.emailInput.type('abc@email.com');
    loginPage.passwordInput.type('abc12');
    loginPage.clickSubmitButton();
    cy.get('div[role=alert]').should(
      'contain.text',
      'must be at least 6 characters'
    );
  });
});
