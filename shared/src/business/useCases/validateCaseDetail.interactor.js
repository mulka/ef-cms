const Case = require('../entities/Case');

/**
 * validateCaseDetail
 * @param applicationContext
 * @param caseInitiator
 * @param user
 * @param fileHasUploaded
 * @returns {Promise<{petitionFileId}>}
 */
exports.validateCaseDetail = ({ caseDetail }) => {
  console.log(caseDetail)
  return new Case(caseDetail).getFormattedValidationErrors();
};
