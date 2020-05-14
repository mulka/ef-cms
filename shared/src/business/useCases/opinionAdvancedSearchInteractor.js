const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const {
  OpinionSearch,
} = require('../../business/entities/opinions/OpinionSearch');
const { Document } = require('../../business/entities/Document');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * opinionAdvancedSearchInteractor
 *
 * @param {object} providers providers object
 * @param {object} providers.applicationContext api applicationContext
 * @param {object} providers.opinionKeyword keyword used for searching opinions
 * @returns {object} the opinions data
 */
exports.opinionAdvancedSearchInteractor = async ({
  applicationContext,
  opinionKeyword,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADVANCED_SEARCH)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const opinionSearch = new OpinionSearch({
    opinionKeyword,
  });

  const rawSearch = opinionSearch.validate().toRawObject();

  const results = await applicationContext
    .getPersistenceGateway()
    .opinionKeywordSearch({
      applicationContext,
      opinionEventCodes: Document.OPINION_DOCUMENT_TYPES,
      ...rawSearch,
    });

  return results;
};
