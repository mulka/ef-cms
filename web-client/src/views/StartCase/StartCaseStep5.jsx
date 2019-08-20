import { AddressDisplay } from '../CaseDetail/PartyInformation';
import { CaseDifferenceModalOverlay } from './CaseDifferenceModalOverlay';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { PDFPreviewButton } from '../PDFPreviewButton';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const StartCaseStep5 = connect(
  {
    constants: state.constants,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.showModal,
    startCaseHelper: state.startCaseHelper,
    submitFilePetitionSequence: sequences.submitFilePetitionSequence,
    user: state.user,
  },
  ({
    constants,
    form,
    formCancelToggleCancelSequence,
    showModal,
    startCaseHelper,
    submitFilePetitionSequence,
    user,
  }) => {
    return (
      <>
        <Focus>
          <h1 className="heading-1" id="file-a-document-header" tabIndex="-1">
            5. Review Your Petition
          </h1>
        </Focus>

        <p>
          You can’t edit your Petition once you submit it. Please make sure your
          information appears the way you want it to.
        </p>

        <Hint>
          Don’t forget to check your PDF(s) to ensure all personal infromation
          has been removed or redacted from all documents{' '}
          <strong>EXCEPT</strong> for the Statement of Taxpayer Identification.
        </Hint>

        <div className="grid-container padding-x-0 create-case-review">
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-4 margin-bottom-4">
              <div className="card height-full margin-bottom-0">
                <div className="content-wrapper">
                  <h3 className="underlined">About Your Petition</h3>
                  <div className="grid-row grid-gap">
                    <div className="tablet:grid-col-6 margin-bottom-1">
                      <div className="tablet:margin-bottom-0 margin-bottom-205">
                        <label className="usa-label" htmlFor="filing-type">
                          Type of Notice/Case
                        </label>
                        {form.caseType}
                        <div className="grid-row margin-top-2">
                          <div className="grid-col">
                            <label
                              className="usa-label"
                              htmlFor="filing-petition"
                            >
                              Petition
                            </label>
                            <FontAwesomeIcon
                              className="fa-icon-blue"
                              icon={['fas', 'file-pdf']}
                            />
                            <PDFPreviewButton
                              file={form.petitionFile}
                              title={form.petitionFile.name}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tablet:grid-col-6 margin-bottom-1">
                      <label className="usa-label" htmlFor="filing-procedure">
                        Case Procedure
                      </label>
                      {form.procedureType}

                      <div className="margin-top-2">
                        <label className="usa-label" htmlFor="filing-location">
                          Trial Location
                        </label>
                        {form.preferredTrialCity}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="tablet:grid-col-8 margin-bottom-4">
              <div className="card height-full margin-bottom-0">
                <div className="content-wrapper">
                  <h3 className="underlined">Petitioner Information</h3>
                  <div className="grid-row grid-gap">
                    <div className="tablet:grid-col-4 margin-bottom-1">
                      <>
                        <label className="usa-label" htmlFor="filing-parties">
                          Party Type
                        </label>
                        {form.partyType}

                        <div className="margin-top-2 margin-bottom-2">
                          <label className="usa-label" htmlFor="filing-parties">
                            Statement of Taxpayer Identification
                          </label>
                          <FontAwesomeIcon
                            className="fa-icon-blue"
                            icon={['fas', 'file-pdf']}
                          />
                          <PDFPreviewButton
                            file={form.stinFile}
                            title={form.stinFile.name}
                          />

                          {form.ownershipDisclosureFile && (
                            <div className="margin-top-2">
                              <label
                                className="usa-label margin-top-2"
                                htmlFor="filing-parties"
                              >
                                Ownership Disclosure Statement
                              </label>
                              <FontAwesomeIcon
                                className="fa-icon-blue"
                                icon={['fas', 'file-pdf']}
                              />
                              <PDFPreviewButton
                                file={form.ownershipDisclosureFile}
                                title={form.ownershipDisclosureFile.name}
                              />
                            </div>
                          )}
                        </div>
                      </>
                    </div>
                    <div className="tablet:grid-col-4 margin-bottom-1">
                      <label
                        className="usa-label"
                        htmlFor="filing-contact-primary"
                      >
                        {startCaseHelper.contactPrimaryLabel}
                      </label>
                      {form.contactPrimary && (
                        <address aria-labelledby="primary-label">
                          {AddressDisplay(form.contactPrimary, constants)}
                        </address>
                      )}
                    </div>
                    <div className="tablet:grid-col-4 margin-bottom-1">
                      {startCaseHelper.hasContactSecondary && (
                        <>
                          <label
                            className="usa-label"
                            htmlFor="filing-contact-secondary"
                          >
                            {startCaseHelper.contactSecondaryLabel}
                          </label>
                          {AddressDisplay(form.contactSecondary, constants)}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tablet:grid-col-12 margin-bottom-4 create-case-review">
          <div className="card height-full margin-bottom-0">
            <div className="content-wrapper">
              <h3 className="underlined">Service Information</h3>
              <div className="grid-row grid-gap">
                <div className="tablet:grid-col-12 margin-bottom-1">
                  <label className="usa-label" htmlFor="filing-service-email">
                    Service Email
                  </label>
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-row grid-gap">
          <div className="tablet:grid-col-12 bg-white submit-reminders">
            <div className="card">
              <div className="content-header bg-accent-cool-dark text-white heading-3">
                A Few Reminders Before You Submit
              </div>
              <div className="content-wrapper">
                <ol className="numbered-list">
                  <li>Double check that your Petition is timely.</li>
                  <li>
                    Be sure you’ve removed or redacted all personal information
                    from your documents.
                  </li>
                  <li>Don’t include any evidence with your Petition.</li>
                  <li>
                    Save your Petition and any IRS notices and uploaded them as
                    a single PDF.
                  </li>
                  <li>
                    Confirm everything appears as you want it to—you can’t edit
                    your Petition after you submit it.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="button-box-container">
          <button
            className="usa-button margin-right-205 margin-bottom-4"
            id="submit-case"
            type="button"
            onClick={() => {
              submitFilePetitionSequence();
            }}
          >
            Submit to U.S. Tax Court
          </button>
          <button
            className="usa-button usa-button--outline margin-bottom-1"
            type="button"
            onClick={() => history.back()}
          >
            Back
          </button>
          <button
            className="usa-button usa-button--unstyled ustc-button--unstyled"
            type="button"
            onClick={() => {
              formCancelToggleCancelSequence();
            }}
          >
            Cancel
          </button>
        </div>
        {showModal === 'CaseDifferenceModalOverlay' && (
          <CaseDifferenceModalOverlay />
        )}
        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal confirmSequence={submitFilePetitionSequence} />
        )}
      </>
    );
  },
);
