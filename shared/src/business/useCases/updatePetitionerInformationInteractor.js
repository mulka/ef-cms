const {
  aggregatePartiesForService,
} = require('../utilities/aggregatePartiesForService');
const {
  CONTACT_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} = require('../entities/EntityConstants');
const {
  copyToNewPdf,
  getAddressPages,
} = require('../useCaseHelper/service/appendPaperServiceAddressPageToPdf');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { addCoverToPdf } = require('./addCoversheetInteractor');
const { Case, getPetitionerById } = require('../entities/cases/Case');
const { defaults, pick } = require('lodash');
const { DOCKET_SECTION } = require('../entities/EntityConstants');
const { DocketEntry } = require('../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../utilities/getCaseCaptionMeta');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');
const { WorkItem } = require('../entities/WorkItem');

const createDocketEntryForChange = async ({
  applicationContext,
  caseEntity,
  contactName,
  documentType,
  newData,
  oldData,
  servedParties,
  user,
}) => {
  const caseDetail = caseEntity.validate().toRawObject();
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  const changeOfAddressPdf = await applicationContext
    .getDocumentGenerators()
    .changeOfAddress({
      applicationContext,
      content: {
        caseCaptionExtension,
        caseTitle,
        docketNumber: caseEntity.docketNumber,
        docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
        documentTitle: documentType.title,
        name: contactName,
        newData,
        oldData,
      },
    });

  const newDocketEntryId = applicationContext.getUniqueId();

  const changeOfAddressDocketEntry = new DocketEntry(
    {
      addToCoversheet: true,
      additionalInfo: `for ${contactName}`,
      docketEntryId: newDocketEntryId,
      docketNumber: caseEntity.docketNumber,
      documentTitle: documentType.title,
      documentType: documentType.title,
      eventCode: documentType.eventCode,
      isAutoGenerated: true,
      isFileAttached: true,
      isOnDocketRecord: true,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      userId: user.userId,
    },
    { applicationContext },
  );
  changeOfAddressDocketEntry.setAsServed(servedParties.all);

  const { pdfData: changeOfAddressPdfWithCover } = await addCoverToPdf({
    applicationContext,
    caseEntity,
    docketEntryEntity: changeOfAddressDocketEntry,
    pdfData: changeOfAddressPdf,
  });

  changeOfAddressDocketEntry.numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      documentBytes: changeOfAddressPdfWithCover,
    });

  caseEntity.addDocketEntry(changeOfAddressDocketEntry);

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: changeOfAddressPdfWithCover,
    key: newDocketEntryId,
  });

  await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
    applicationContext,
    caseEntity,
    docketEntryId: changeOfAddressDocketEntry.docketEntryId,
    servedParties,
  });

  return { changeOfAddressDocketEntry, changeOfAddressPdfWithCover };
};

const createWorkItemForChange = async ({
  applicationContext,
  caseEntity,
  changeOfAddressDocketEntry,
  user,
}) => {
  const workItem = new WorkItem(
    {
      assigneeId: null,
      assigneeName: null,
      associatedJudge: caseEntity.associatedJudge,
      caseIsInProgress: caseEntity.inProgress,
      caseStatus: caseEntity.status,
      caseTitle: Case.getCaseTitle(Case.getCaseCaption(caseEntity)),
      docketEntry: {
        ...changeOfAddressDocketEntry.toRawObject(),
        createdAt: changeOfAddressDocketEntry.createdAt,
      },
      docketNumber: caseEntity.docketNumber,
      docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
      section: DOCKET_SECTION,
      sentBy: user.name,
      sentByUserId: user.userId,
    },
    { applicationContext },
  );

  changeOfAddressDocketEntry.setWorkItem(workItem);

  await applicationContext
    .getPersistenceGateway()
    .saveWorkItemAndAddToSectionInbox({
      applicationContext,
      workItem: workItem.validate().toRawObject(),
    });
};

const generatePaperServicePdf = async ({
  applicationContext,
  caseEntity,
  servedParties,
  primaryChangeDocs = {},
  secondaryChangeDocs = {},
}) => {
  const { PDFDocument } = await applicationContext.getPdfLib();
  const fullDocument = await PDFDocument.create();
  const addressPages = await getAddressPages({
    applicationContext,
    caseEntity,
    servedParties,
  });

  for (const changeDocs of [primaryChangeDocs, secondaryChangeDocs]) {
    if (changeDocs && changeDocs.changeOfAddressPdfWithCover) {
      await copyToNewPdf({
        addressPages,
        applicationContext,
        newPdfDoc: fullDocument,
        noticeDoc: await PDFDocument.load(
          changeDocs.changeOfAddressPdfWithCover,
        ),
      });
    }
  }

  const paperServicePdfData = await fullDocument.save();
  const paperServicePdfId = applicationContext.getUniqueId();
  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: paperServicePdfData,
    key: paperServicePdfId,
    useTempBucket: true,
  });

  const {
    url,
  } = await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    key: paperServicePdfId,
    useTempBucket: true,
  });
  return url;
};

const createDocketEntryAndWorkItem = async ({
  applicationContext,
  caseEntity,
  change,
  editableFields,
  oldCaseContact,
  partyWithPaperService,
  privatePractitionersRepresentingContact,
  servedParties,
  user,
}) => {
  const changeDocs = await createDocketEntryForChange({
    applicationContext,
    caseEntity,
    contactName: editableFields.name,
    documentType: change,
    newData: editableFields,
    oldData: oldCaseContact,
    servedParties,
    user,
  });

  if (!privatePractitionersRepresentingContact || partyWithPaperService) {
    await createWorkItemForChange({
      applicationContext,
      caseEntity,
      changeOfAddressDocketEntry: changeDocs.changeOfAddressDocketEntry,
      user,
    });
  }
  return changeDocs;
};

/**
 * updatePetitionerInformationInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {string} providers.updatedPetitionerData the updatedPetitionerData to update
 * @returns {object} the updated case data
 */
exports.updatePetitionerInformationInteractor = async (
  applicationContext,
  { docketNumber, updatedPetitionerData },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.EDIT_PETITIONER_INFO)) {
    throw new UnauthorizedError('Unauthorized for editing petition details');
  }

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const oldCaseContact = getPetitionerById(
    oldCase,
    updatedPetitionerData.contactId,
  );

  if (!oldCaseContact) {
    throw new NotFoundError(
      `Case contact with id ${updatedPetitionerData.contactId} was not found on the case`,
    );
  }

  const editableFields = pick(
    defaults(updatedPetitionerData, {
      additionalName: undefined,
      address2: undefined,
      address3: undefined,
      title: undefined,
    }),
    [
      'address1',
      'address2',
      'address3',
      'city',
      'country',
      'countryType',
      'name',
      'phone',
      'postalCode',
      'additionalName',
      'serviceIndicator',
      'state',
    ],
  );

  const petitionerInfoChange = applicationContext
    .getUtilities()
    .getDocumentTypeForAddressChange({
      newData: editableFields,
      oldData: oldCaseContact,
    });

  const caseToUpdateContacts = new Case(
    {
      ...oldCase,
    },
    { applicationContext },
  );

  try {
    caseToUpdateContacts.updatePetitioner({
      additionalName: oldCaseContact.additionalName,
      contactId: oldCaseContact.contactId,
      contactType: oldCaseContact.contactType,
      email: oldCaseContact.email,
      hasEAccess: oldCaseContact.hasEAccess,
      isAddressSealed: oldCaseContact.isAddressSealed,
      otherFilerType: oldCaseContact.otherFilerType,
      sealedAndUnavailable: oldCaseContact.sealedAndUnavailable,
      ...editableFields,
    });
  } catch (e) {
    applicationContext.logger.info(
      `Case contact with id ${updatedPetitionerData.contactId} was not found on the case`,
    );
    throw new NotFoundError(e.message);
  }

  //send back through the constructor so the contacts are created with the contact constructor
  let caseEntity = new Case(
    {
      ...caseToUpdateContacts.toRawObject(),
    },
    { applicationContext },
  ).validate();

  const servedParties = aggregatePartiesForService(caseEntity);

  let petitionerChangeDocs;
  let paperServicePdfUrl;

  const updatedCaseContact = caseEntity.getPetitionerById(
    updatedPetitionerData.contactId,
  );

  if (petitionerInfoChange && !updatedCaseContact.isAddressSealed) {
    const partyWithPaperService = caseEntity.hasPartyWithPaperService();

    if (petitionerInfoChange) {
      let privatePractitionersRepresentingContact;
      if (updatedCaseContact.contactType === CONTACT_TYPES.primary) {
        privatePractitionersRepresentingContact = caseEntity.privatePractitioners.some(
          privatePractitioner =>
            privatePractitioner.getRepresentingPrimary(caseEntity),
        );
      } else if (updatedCaseContact.contactType === CONTACT_TYPES.secondary) {
        privatePractitionersRepresentingContact = caseEntity.privatePractitioners.some(
          privatePractitioner =>
            privatePractitioner.getRepresentingSecondary(caseEntity),
        );
      }

      petitionerChangeDocs = await createDocketEntryAndWorkItem({
        applicationContext,
        caseEntity,
        change: petitionerInfoChange,
        editableFields,
        oldCaseContact,
        partyWithPaperService,
        privatePractitionersRepresentingContact,
        servedParties,
        user,
      });
    }

    if (servedParties.paper.length > 0) {
      paperServicePdfUrl = await generatePaperServicePdf({
        applicationContext,
        caseEntity,
        primaryChangeDocs: petitionerChangeDocs,
        servedParties,
      });
    }
  }

  if (
    updatedPetitionerData.email &&
    updatedPetitionerData.email !== oldCaseContact.email
  ) {
    const isEmailAvailable = await applicationContext
      .getPersistenceGateway()
      .isEmailAvailable({
        applicationContext,
        email: updatedPetitionerData.email,
      });
    if (isEmailAvailable) {
      caseEntity = await applicationContext
        .getUseCaseHelpers()
        .createUserForContact({
          applicationContext,
          caseEntity,
          contactId: updatedPetitionerData.contactId,
          email: updatedPetitionerData.email,
          name: updatedCaseContact.name,
        });
    } else {
      caseEntity = await applicationContext
        .getUseCaseHelpers()
        .addExistingUserToCase({
          applicationContext,
          caseEntity,
          contactId: updatedPetitionerData.contactId,
          email: updatedPetitionerData.email,
          name: updatedCaseContact.name,
        });
    }
  }

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return {
    paperServiceParties: servedParties.paper,
    paperServicePdfUrl,
    updatedCase,
  };
};
