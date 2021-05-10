const MINIMUM_PASSWORD_LENGTH = 6;
const MAXIMUM_PASSWORD_LENGTH = 10;

export const formRules = {
  EMAIL_REQUIRED: {
    required: true,
    message: 'Email is required'
  },
  EMAIL_FORMAT: {
    type: 'email',
    message: 'Email is invalid'
  },
  USERNAME_REQUIRED: {
    required: true,
    message: 'Username is required'
  },
  USERNAME_FORMAT: () => ({
    validator(_rule, value) {
      if (value && value.includes(' '))
        return Promise.reject('Username cannot contain space');
      return Promise.resolve();
    }
  }),
  PASSWORD_FORMAT: {
    pattern: new RegExp(
      `^(?=\\S*[a-zA-Z])(?=\\S*\\d)(?=\\S*([^\\w\\s]|[_]))\\S{${MINIMUM_PASSWORD_LENGTH},${MAXIMUM_PASSWORD_LENGTH}}$`
    ),
    message: `Password should consist of at least one letter, one number, one special character and be at least ${MINIMUM_PASSWORD_LENGTH} to ${MAXIMUM_PASSWORD_LENGTH} characters long.`
  },
  PASSWORD_REQUIRED: {
    required: true,
    message: 'Password is required'
  },
  CONFIRM_PASSWORD_REQUIRED: {
    required: true,
    message: 'Please confirm password'
  },
  PASSWORD_MATCH: ({ getFieldValue }) => ({
    validator(_rule, value) {
      if (!value || getFieldValue('password') == value) {
        return Promise.resolve();
      }
      return Promise.reject('Please enter identical password');
    }
  }),
  LOGIN_PASSWORD_FORMAT: {
    required: true,
    min: MINIMUM_PASSWORD_LENGTH,
    message: `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters`
  },
  MONEY_FORMAT: {
    required: true,
    pattern: /^0$|^([1-9])+(\d)*$|^(\d)+(\.)\d{1,2}$/,
    message: 'Please key in valid number'
  }
};
