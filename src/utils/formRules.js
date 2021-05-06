export const formRules = {
  FIELD_REQUIRED: {
    required: true,
    message: 'This field is required'
  },
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
    pattern: /^(?=\S*[a-zA-Z])(?=\S*\d)(?=\S*([^\w\s]|[_]))\S{6,10}$/,
    message:
      'Password should consist of at least one letter, one number, one special charactoer and be at least 6 to 10 characters long.'
  },
  PASSWORD_REQUIRED: {
    required: true,
    message: 'Please select a valid password.'
  },
  PASSWORD_MATCH: ({ getFieldValue }) => ({
    validator(_rule, value) {
      if (!value || getFieldValue('password') == value) {
        return Promise.resolve();
      }
      return Promise.reject('Please enter identical password');
    }
  })
};
