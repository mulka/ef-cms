const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  feature_8652_noticeOfReceiptOfPetition,
} = require('./feature_8652_noticeOfReceiptOfPetition');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const { getChromiumBrowser } = require('../getChromiumBrowser');

describe('documentGenerators', () => {
  const testOutputPath = path.resolve(
    __dirname,
    '../../../../test-output/document-generation',
  );

  const writePdfFile = (name, data) => {
    const pdfPath = `${testOutputPath}/${name}.pdf`;
    fs.writeFileSync(pdfPath, data);
  };

  beforeAll(() => {
    if (process.env.PDF_OUTPUT) {
      fs.mkdirSync(testOutputPath, { recursive: true }, err => {
        if (err) throw err;
      });

      applicationContext.getChromiumBrowser.mockImplementation(
        getChromiumBrowser,
      );

      applicationContext
        .getUseCases()
        .generatePdfFromHtmlInteractor.mockImplementation(
          generatePdfFromHtmlInteractor,
        );
    }
  });

  describe('feature_8652_noticeOfReceiptOfPetition', () => {
    it('generates a Notice of Receipt of Petition document', async () => {
      const pdf = await feature_8652_noticeOfReceiptOfPetition({
        applicationContext,
        data: {
          address: {
            address1: '123 Some St.',
            city: 'Somecity',
            countryName: '',
            name: 'Test Petitioner',
            postalCode: '80008',
            state: 'ZZ',
          },
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          preferredTrialCity: 'Birmingham, Alabama',
          receivedAtFormatted: 'December 1, 2019',
          servedDate: 'June 3, 2020',
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Feature_8652_Notice_Receipt_Petition', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });
});
