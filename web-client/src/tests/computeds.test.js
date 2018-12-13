import { runCompute } from 'cerebral/test';
import assert from 'assert';

import {
  formattedCaseDetail,
  formattedCases,
} from '../presenter/computeds/formattedCaseDetail';

import { formattedSearchParams } from '../presenter/computeds/formattedSearchParams';

describe('formatted case details computed', () => {
  it('formats the date', () => {
    const result = runCompute(formattedCaseDetail, {
      state: {
        caseDetail: { irsDate: '2018-11-21T20:49:28.192Z', documents: [] },
        form: {},
      },
    });
    expect(result.irsDateFormatted).toContain('11/21/2018');
  });

  it('formats the date in a list of cases', () => {
    const result = runCompute(formattedCases, {
      state: {
        cases: [{ irsDate: '2018-11-21T20:49:28.192Z', documents: [] }],
      },
    });
    expect(result[0].irsDateFormatted).toContain('11/21/2018');
  });

  it('formats the respondent name to include barnumber', () => {
    const result = runCompute(formattedCases, {
      state: {
        cases: [{ respondent: { name: 'test', barNumber: '123'} }],
      },
    });
    expect(result[0].respondent.formattedName).toContain('test 123');
  });
});

describe('formatted search parameters computed', () => {
  it('formats a docket number search param', () => {
    const result = runCompute(formattedSearchParams, {
      state: { searchTerm: '101-18' },
    });
    // currently noop
    assert.equal(result, '101-18');
  });
});
