import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeFormDateAction } from '../actions/FileDocument/computeFormDateAction';
import { computeSecondaryFormDateAction } from '../actions/FileDocument/computeSecondaryFormDateAction';
import { defaultSecondaryDocumentAction } from '../actions/FileDocument/defaultSecondaryDocumentAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { navigateToFileADocumentAction } from '../actions/FileDocument/navigateToFileADocumentAction';
import { setDefaultFileDocumentFormValuesAction } from '../actions/FileDocument/setDefaultFileDocumentFormValuesAction';
import { setDocketNumberPropAction } from '../actions/FileDocument/setDocketNumberPropAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateSelectDocumentTypeAction } from '../actions/validateSelectDocumentTypeAction';

export const completeDocumentSelectSequence = [
  startShowValidationAction,
  computeFormDateAction,
  computeSecondaryFormDateAction,
  defaultSecondaryDocumentAction,
  validateSelectDocumentTypeAction,
  {
    error: [setValidationErrorsAction],
    success: [
      clearAlertsAction,
      stopShowValidationAction,
      generateTitleAction,
      setDocketNumberPropAction,
      setDefaultFileDocumentFormValuesAction,
      navigateToFileADocumentAction,
    ],
  },
];
