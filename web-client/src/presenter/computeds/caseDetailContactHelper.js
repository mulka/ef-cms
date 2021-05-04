import { state } from 'cerebral';

export const caseDetailContactHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);

  const contactPrimary = applicationContext
    .getUtilities()
    .getContactPrimary(caseDetail);

  const contactSecondary = applicationContext
    .getUtilities()
    .getContactSecondary(caseDetail);

  console.log('contactSecondary', contactSecondary);

  return { contactPrimary, contactSecondary };
};
