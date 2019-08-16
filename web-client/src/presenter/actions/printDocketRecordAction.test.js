import { presenter } from '../presenter';
import { printDocketRecordAction } from './printDocketRecordAction';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = {
  getEntityConstructors: () => {
    return {
      ContactFactory: {
        COUNTRY_TYPES: {
          INTERNATIONAL: 'International',
        },
      },
    };
  },
};

const mockState = {
  caseDetailHelper: {
    caseCaptionPostfix: 'Caption Postfix',
    caseName: 'Case Name',
    showCaseNameForPrimary: false,
  },
  formattedCaseDetail: {
    caseCaption: 'Test Caption',
    caseDetailHelper: {},
    contactPrimary: {
      address1: '123 Main St',
      address2: 'Apartment 1',
      address3: 'PO Box 1337',
      city: 'Flavortown',
      country: 'Georgia',
      countryType: presenter.providers.applicationContext.getEntityConstructors()
        .ContactFactory.COUNTRY_TYPES.INTERNATIONAL,
      inCareOf: 'Someone',
      name: 'Test Petitioner',
      phone: '1234567890',
      postalCode: '12345',
      state: 'FL',
      title: 'Mr',
    },
    contactSecondary: {
      address1: '321 Secondary Rd',
      address2: 'Apt 2',
      address3: 'PO Box 42',
      city: 'Flavortown',
      country: 'Georgia',
      inCareOf: 'Guy Fieri',
      name: 'Rachael Ray',
      phone: '0987654321',
      postalCode: '54321',
      state: 'AL',
      title: 'Miss',
    },
    docketNumberWithSuffix: '123-45S',
    docketRecordWithDocument: [
      {
        document: {
          additionalInfo2: '[Additional Info 2]',
          createdAtFormatted: '11/12/2011',
          eventCode: 'eventCode',
          filedBy: 'George Washington',
          isStatusServed: true,
          servedAtFormatted: '11/12/2012',
          servedPartiesCode: '',
        },
        index: 1,
        record: {
          action: 'Yeehaw',
          createdAtFormatted: '11/12/2011',
          description: 'Title [Additional Info 1]',
          filingsAndProceedings: 'Attachment(s)',
        },
      },
    ],
    practitioners: [
      {
        formattedName: 'Test Practitioner (PT1234)',
        representingPrimary: true,
        representingSecondary: true,
        userId: '123',
      },
      {
        formattedName: 'Test Practitioner (PT1233)',
        representingPrimary: true,
        userId: '122',
      },
      {
        formattedName: 'Test Practitioner (PT1233)',
        representingSecondary: true,
        userId: '122',
      },
    ],
    respondents: [
      {
        addressLine1: '123 Main St',
        name: 'Yee Haw',
      },
    ],
  },
};

describe('printDocketRecordAction', () => {
  it('generate html for a printable docket record', async () => {
    const result = await runAction(printDocketRecordAction, {
      modules: {
        presenter,
      },
      state: mockState,
    });

    expect(result.output.docketNumber).toEqual(
      mockState.formattedCaseDetail.docketNumberWithSuffix,
    );
    expect(result.output.docketRecordHtml).toContain(
      mockState.formattedCaseDetail.caseCaption,
    );
    expect(result.output.docketRecordHtml).toContain(
      mockState.formattedCaseDetail.contactPrimary.name,
    );
    expect(result.output.docketRecordHtml).toContain(
      mockState.caseDetailHelper.caseCaptionPostfix,
    );
    expect(result.output.docketRecordHtml).toContain(
      mockState.formattedCaseDetail.practitioners.formattedName,
    );
    expect(result.output.docketRecordHtml).toContain('Representing');
  });

  it('generates html for a printable docket record with other conditions', async () => {
    const mockState2 = {
      ...mockState,
      caseDetailHelper: {
        caseName: 'Yee vs. Haw',
        showCaseNameForPrimary: true,
      },
      contactPrimary: null,
      contactSecondary: null,
      docketRecordWithDocument: [
        {
          document: {
            additionalInfo2: '[Additional Info 2]',
            createdAtFormatted: '11/12/2011',
            isStatusServed: true,
          },
          index: 1,
          record: {
            action: false,
            createdAtFormatted: '11/12/2011',
            description: 'Title [Additional Info 1]',
            filingsAndProceedings: 'Attachment(s)',
          },
        },
      ],
    };
    const result = await runAction(printDocketRecordAction, {
      modules: {
        presenter,
      },
      state: mockState2,
    });

    expect(result.output.docketNumber).toEqual(
      mockState2.formattedCaseDetail.docketNumberWithSuffix,
    );
    expect(result.output.docketRecordHtml).toContain(
      mockState2.formattedCaseDetail.caseCaption,
    );
    expect(result.output.docketRecordHtml).toContain(
      mockState2.formattedCaseDetail.contactPrimary.name,
    );
    expect(result.output.docketRecordHtml).toContain(
      mockState2.caseDetailHelper.caseCaptionPostfix,
    );
    expect(result.output.docketRecordHtml).toContain(
      mockState2.formattedCaseDetail.practitioners.formattedName,
    );
    expect(result.output.docketRecordHtml).toContain('Representing');
  });
});
