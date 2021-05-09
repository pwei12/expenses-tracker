import { HTTP_POST_METHOD } from '../../../src/constants/http';

const ROOT = 'http://localhost:3000';
const SIGNUP_PAGE = `${ROOT}/signup`;
const SIGNUP_ENDPOINT = `${ROOT}/api/users/signup`;

describe('Signup page', () => {
  beforeEach(() => {
    cy.visit(SIGNUP_PAGE);
  });

  class SignupPage {
    get userNameInput() {
      return cy.getByLabel('Username');
    }
    get emailInput() {
      return cy.getByLabel('Email');
    }
    get passwordInput() {
      return cy.getByLabel('Password');
    }
    get confirmPasswordInput() {
      return cy.getByLabel('Confirm Password');
    }
    clickSubmitButton() {
      return cy.get('button[type=submit]').contains('Submit').click();
    }
  }

  const signupPage = new SignupPage();

  it('should show success message when signup successfully', () => {
    cy.intercept(HTTP_POST_METHOD, SIGNUP_ENDPOINT, { success: true });
    signupPage.userNameInput.type('hello');
    signupPage.emailInput.type('abc@email.com');
    signupPage.passwordInput.type('abc123#');
    signupPage.confirmPasswordInput.type('abc123#');
    signupPage.clickSubmitButton();
    cy.get('span').should('contain.text', 'Signup completed');
  });

  it('should show error message when signup failed', () => {
    cy.intercept(HTTP_POST_METHOD, SIGNUP_ENDPOINT, {
      success: false,
      reason: 'Signup failed'
    });
    signupPage.userNameInput.type('hello');
    signupPage.emailInput.type('abc@email.com');
    signupPage.passwordInput.type('abc123#');
    signupPage.confirmPasswordInput.type('abc123#');
    signupPage.clickSubmitButton();
    cy.get('span').should('contain.text', 'Signup failed');
  });

  it('should fail to submit signup form when username is not keyed in', () => {
    signupPage.emailInput.type('abc@email.com');
    signupPage.passwordInput.type('abc123#');
    signupPage.confirmPasswordInput.type('abc123#');
    signupPage.clickSubmitButton();
    cy.get('div[role=alert]').should('contain.text', 'Username is required');
  });

  it('should fail to submit signup form when email is not keyed in', () => {
    signupPage.userNameInput.type('hello');
    signupPage.passwordInput.type('abc123#');
    signupPage.confirmPasswordInput.type('abc123#');
    signupPage.clickSubmitButton();
    cy.get('div[role=alert]').should('contain.text', 'Email is required');
  });

  it('should fail to submit signup form when password is not keyed in', () => {
    signupPage.userNameInput.type('hello');
    signupPage.emailInput.type('abc@email.com');
    signupPage.confirmPasswordInput.type('abc123#');
    signupPage.clickSubmitButton();
    cy.get('div[role=alert]').should('contain.text', 'Password is required');
  });

  it('should fail to submit signup form when second password is not keyed in', () => {
    signupPage.userNameInput.type('hello');
    signupPage.emailInput.type('abc@email.com');
    signupPage.passwordInput.type('abc123#');
    signupPage.clickSubmitButton();
    cy.get('div[role=alert]').should('contain.text', 'Please confirm password');
  });

  it('should fail to submit signup form when email is of invalid format', () => {
    signupPage.userNameInput.type('hello');
    signupPage.emailInput.type('abc@emailcom');
    signupPage.passwordInput.type('abc123#');
    signupPage.confirmPasswordInput.type('abc123#');
    signupPage.clickSubmitButton();
    cy.get('div[role=alert]').should('contain.text', 'Email is invalid');
  });

  it('should fail to submit signup form when password is less than 6 characters', () => {
    signupPage.userNameInput.type('hello');
    signupPage.emailInput.type('abc@email.com');
    signupPage.passwordInput.type('abc1#');
    signupPage.confirmPasswordInput.type('abc1#');
    signupPage.clickSubmitButton();
    cy.get('div[role=alert]').should(
      'contain.text',
      'Password should consist of'
    );
  });

  it('should fail to submit signup form when password does not have alphabet', () => {
    signupPage.userNameInput.type('hello');
    signupPage.emailInput.type('abc@email.com');
    signupPage.passwordInput.type('123456');
    signupPage.confirmPasswordInput.type('123456');
    signupPage.clickSubmitButton();
    cy.get('div[role=alert]').should(
      'contain.text',
      'Password should consist of'
    );
  });

  it('should fail to submit signup form when password does not have number', () => {
    signupPage.userNameInput.type('hello');
    signupPage.emailInput.type('abc@email.com');
    signupPage.passwordInput.type('abcdef');
    signupPage.confirmPasswordInput.type('abcdef');
    signupPage.clickSubmitButton();
    cy.get('div[role=alert]').should(
      'contain.text',
      'Password should consist of'
    );
  });

  it('should fail to submit signup form when password does not have special character', () => {
    signupPage.userNameInput.type('hello');
    signupPage.emailInput.type('abc@email.com');
    signupPage.passwordInput.type('abc123');
    signupPage.confirmPasswordInput.type('abc123@');
    signupPage.clickSubmitButton();
    cy.get('div[role=alert]').should(
      'contain.text',
      'Password should consist of'
    );
  });

  it('should fail to submit signup form when passwords are not identical', () => {
    signupPage.userNameInput.type('hello');
    signupPage.emailInput.type('abc@email.com');
    signupPage.passwordInput.type('abc123#');
    signupPage.confirmPasswordInput.type('abc123@');
    signupPage.clickSubmitButton();
    cy.get('div[role=alert]').should(
      'contain.text',
      'Please enter identical password'
    );
  });
});
