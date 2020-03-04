const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * updateAttorneyUserInteractor
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context
 * @param {Object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
exports.updateAttorneyUserInteractor = async ({ applicationContext, user }) => {
  const requestUser = applicationContext.getCurrentUser();
  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.MANAGE_ATTORNEY_USERS)) {
    throw new UnauthorizedError('Unauthorized for updating attorney user');
  }

  const createdUser = await applicationContext
    .getPersistenceGateway()
    .updateAttorneyUser({
      applicationContext,
      user,
    });

  return new User(createdUser, { applicationContext }).validate().toRawObject();
};
