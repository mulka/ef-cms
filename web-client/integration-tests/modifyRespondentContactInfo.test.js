import { loginAs, setupTest, uploadPetition } from './helpers';
import respondentUpdatesAddress from './journey/respondentUpdatesAddress';
import respondentViewsCaseDetailNoticeOfChangeOfAddress from './journey/respondentViewsCaseDetailNoticeOfChangeOfAddress';

const test = setupTest();

describe('Modify Respondent Contact Information', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.docketNumber = undefined;
  });

  let caseDetail;
  test.createdDocketNumbers = [];

  for (let i = 0; i < 3; i++) {
    loginAs(test, 'petitioner');

    it(`create case #${i} and associate a respondent`, async () => {
      caseDetail = await uploadPetition(test);
      test.createdDocketNumbers.push(caseDetail.docketNumber);
    });

    loginAs(test, 'petitionsclerk');

    it('associates a respondent', async () => {
      test.setState('caseDetail', caseDetail);
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: test.createdDocketNumbers[i],
      });
      await test.runSequence('updateFormValueSequence', {
        key: 'respondentSearch',
        value: 'RT6789',
      });
      await test.runSequence('openAddIrsPractitionerModalSequence');
      await test.runSequence('associateIrsPractitionerWithCaseSequence');
      expect(test.getState('caseDetail.irsPractitioners.length')).toEqual(1);
    });
  }

  loginAs(test, 'irsPractitioner');
  respondentUpdatesAddress(test);
  for (let i = 0; i < 3; i++) {
    test.docketNumber = test.createdDocketNumbers[i];
    respondentViewsCaseDetailNoticeOfChangeOfAddress(test, i);
  }
});
