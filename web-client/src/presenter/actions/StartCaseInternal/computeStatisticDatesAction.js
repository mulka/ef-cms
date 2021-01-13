import { state } from 'cerebral';

export const combineLastDateOfPeriodFields = ({ applicationContext, form }) => {
  const newForm = {
    ...form,
  };

  if (
    applicationContext
      .getUtilities()
      .isValidDateString(
        `${newForm.lastDateOfPeriodMonth}-${newForm.lastDateOfPeriodDay}-${newForm.lastDateOfPeriodYear}`,
      )
  ) {
    const computedLastDateOfPeriod = applicationContext
      .getUtilities()
      .createISODateStringFromObject({
        day: newForm.lastDateOfPeriodDay,
        month: newForm.lastDateOfPeriodMonth,
        year: newForm.lastDateOfPeriodYear,
      });
    newForm.lastDateOfPeriod = computedLastDateOfPeriod;
  } else {
    newForm.lastDateOfPeriod = undefined;
  }
  return newForm;
};

/**
 * computes the dates for the statistics array from the form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const computeStatisticDatesAction = ({
  applicationContext,
  get,
  store,
}) => {
  let statistics = get(state.form.statistics) || [];

  statistics = statistics.map(statistic =>
    combineLastDateOfPeriodFields({
      applicationContext,
      form: statistic,
    }),
  );

  console.log('LE DATES N STUFFZ', get(state.form));

  store.set(state.form.statistics, statistics);
};
