const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { SERVICE_INDICATOR_TYPES } = require('../EntityConstants');

/**
 * Add Private Practitioner Factory entity
 *
 * @param {object} rawProps the raw private practitioner data
 * @constructor
 */
function AddPrivatePractitionerFactory(rawProps) {
  /**
   * bare constructor for entity factory
   */
  function entityConstructor() {}

  entityConstructor.prototype.init = function init(rawPropsParam) {
    Object.assign(this, {
      email: rawPropsParam.user?.email,
      representing: rawPropsParam.representing,
      serviceIndicator: rawPropsParam.serviceIndicator,
      user: rawPropsParam.user,
    });
  };

  const schema = {
    email: JoiValidationConstants.STRING.optional(),
    representing: joi
      .array()
      .items(JoiValidationConstants.UUID.required())
      .required(),
    serviceIndicator: joi
      .when('email', {
        is: joi.exist().not(null),
        otherwise: JoiValidationConstants.STRING.valid(
          SERVICE_INDICATOR_TYPES.SI_NONE,
          SERVICE_INDICATOR_TYPES.SI_PAPER,
        ),
        then: JoiValidationConstants.STRING.valid(
          ...Object.values(SERVICE_INDICATOR_TYPES),
        ),
      })
      .required(),
    user: joi.object().required(),
  };

  joiValidationDecorator(
    entityConstructor,
    schema,
    AddPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES,
  );

  return new (validEntityDecorator(entityConstructor))(rawProps);
}

AddPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES = {
  representing: 'Select a represented party',
  serviceIndicator: [
    {
      contains: 'must be one of',
      message:
        'No email found for electronic service. Select a valid service preference.',
    },
    'Select service type',
  ],
  user: 'Select a petitioner counsel',
};

module.exports = { AddPrivatePractitionerFactory };
