const {
  validateUpdateUserEmailInteractor,
} = require('./validateUpdateUserEmailInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('validateUpdateUserEmailInteractor', () => {
  it('runs validation on update user email form data with no invalid properties', () => {
    const errors = validateUpdateUserEmailInteractor(applicationContext, {
      updateUserEmail: {
        confirmEmail: 'test@example.com',
        email: 'test@example.com',
      },
    });

    expect(errors).toBeFalsy();
  });

  it('runs validation on update user email form data with missing data', () => {
    const errors = validateUpdateUserEmailInteractor(applicationContext, {
      updateUserEmail: {},
    });

    expect(errors).toBeDefined();
  });
});
