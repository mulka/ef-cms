const { CONTACT_TYPES } = require('../entities/EntityConstants');
const { isEmpty } = require('lodash');
const { Petitioner } = require('../entities/contacts/Petitioner');
const { some } = require('lodash');
const { UpdateUserEmail } = require('../entities/UpdateUserEmail');

/**
 * validatePetitionerInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.contactInfo the contactInfo to validate
 * @returns {object} errors (null if no errors)
 */
exports.validatePetitionerInteractor = (
  applicationContext,
  { contactInfo, existingPetitioners },
) => {
  const contactErrors = new Petitioner(contactInfo, {
    applicationContext,
  }).getFormattedValidationErrors();

  let updateUserEmailErrors;
  if (contactInfo.updatedEmail || contactInfo.confirmEmail) {
    updateUserEmailErrors = new UpdateUserEmail(
      { ...contactInfo, email: contactInfo.updatedEmail },
      { applicationContext },
    ).getFormattedValidationErrors();
  }

  const aggregatedErrors = {
    ...contactErrors,
    ...updateUserEmailErrors,
  };

  if (
    some(existingPetitioners, { contactType: CONTACT_TYPES.intervenor }) &&
    contactInfo.contactType === CONTACT_TYPES.intervenor
  ) {
    aggregatedErrors.contactType =
      Petitioner.VALIDATION_ERROR_MESSAGES.contactTypeSecondIntervenor;
  }

  return !isEmpty(aggregatedErrors) ? aggregatedErrors : undefined;
};