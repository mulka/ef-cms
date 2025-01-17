import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseAssociationAction } from './getCaseAssociationAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getCaseAssociation', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .verifyPendingCaseForUserInteractor.mockReturnValue(false);
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.privatePractitioner,
      userId: '123',
    });
  });

  it('should return that practitioner is associated', async () => {
    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          privatePractitioners: [{ userId: '123' }],
        },
      },
    });

    expect(results.output).toEqual({
      isAssociated: true,
      pendingAssociation: false,
    });
  });

  it('should return that practitioner has pending association', async () => {
    applicationContext
      .getUseCases()
      .verifyPendingCaseForUserInteractor.mockReturnValue(true);
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.privatePractitioner,
      userId: '1234',
    });

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          privatePractitioners: [{ userId: '123' }],
        },
      },
    });

    expect(results.output).toEqual({
      isAssociated: false,
      pendingAssociation: true,
    });
  });

  it('should return that practitioner not associated', async () => {
    applicationContext
      .getUseCases()
      .verifyPendingCaseForUserInteractor.mockReturnValue(false);
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.privatePractitioner,
      userId: '1234',
    });

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          privatePractitioners: [{ userId: '123' }],
        },
      },
    });

    expect(results.output).toEqual({
      isAssociated: false,
      pendingAssociation: false,
    });
  });

  it('should return that respondent is associated', async () => {
    applicationContext
      .getUseCases()
      .verifyPendingCaseForUserInteractor.mockReturnValue(false);
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsPractitioner,
      userId: '789',
    });

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          irsPractitioners: [{ userId: '789' }],
        },
      },
    });

    expect(results.output).toEqual({
      isAssociated: true,
      pendingAssociation: false,
    });
  });

  it('should return that internal user is associated', async () => {
    applicationContext.getUtilities().isInternalUser.mockReturnValueOnce(true);
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'something internal',
      userId: '987',
    });

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
    });

    expect(results.output).toEqual({
      isAssociated: true,
      pendingAssociation: false,
    });
  });

  it('should return that other roles are NOT associated', async () => {
    applicationContext.getUtilities().isInternalUser.mockReturnValueOnce(false);
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'something not internal',
      userId: '987',
    });

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
    });

    expect(results.output).toEqual({
      isAssociated: false,
      pendingAssociation: false,
    });
  });

  it('should return that respondent is not associated', async () => {
    applicationContext
      .getUseCases()
      .verifyPendingCaseForUserInteractor.mockReturnValue(true);
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsPractitioner,
      userId: '789',
    });

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          irsPractitioners: [{ userId: '123' }],
        },
      },
    });

    expect(results.output).toEqual({
      isAssociated: false,
      pendingAssociation: false,
    });
  });

  it('should return that petitioner is associated when their userId is found in the case petitioners array', async () => {
    applicationContext
      .getUseCases()
      .verifyPendingCaseForUserInteractor.mockReturnValue(false);
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: '123',
    });

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          petitioners: [
            {
              contactId: '123',
            },
          ],
        },
      },
    });

    expect(results.output).toEqual({
      isAssociated: true,
      pendingAssociation: false,
    });
  });

  it('should return that petitioner is not associated', async () => {
    applicationContext
      .getUseCases()
      .verifyPendingCaseForUserInteractor.mockReturnValue(true);
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: '789',
    });
    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          petitioners: [
            {
              contactId: '456',
            },
          ],
          userId: '123',
        },
      },
    });

    expect(results.output).toEqual({
      isAssociated: false,
      pendingAssociation: false,
    });
  });

  it('should return true for isAssociated and false for pendingAssociation if the user is an internal user', async () => {
    applicationContext
      .getUseCases()
      .verifyPendingCaseForUserInteractor.mockReturnValue(false);
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: '123',
    });

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          privatePractitioners: [{ userId: '123' }],
        },
      },
    });

    expect(results.output).toEqual({
      isAssociated: true,
      pendingAssociation: false,
    });
  });

  it('should return false for isAssociated and pendingAssociation if the user is an irsSuperuser and no docket entry on the case is served', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsSuperuser,
      userId: '123',
    });

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          docketEntries: [{ documentType: 'Petition' }],
        },
      },
    });

    expect(results.output).toEqual({
      isAssociated: false,
      pendingAssociation: false,
    });
  });

  it('should return true for isAssociated and false for pendingAssociation if the user is an irsSuperuser and a single docket entry on the case is served', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsSuperuser,
      userId: '123',
    });

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          docketEntries: [
            {
              documentType: 'Legacy Petition',
              servedAt: '2019-03-01T21:40:46.415Z',
            },
          ],
        },
      },
    });

    expect(results.output).toEqual({
      isAssociated: true,
      pendingAssociation: false,
    });
  });
});
