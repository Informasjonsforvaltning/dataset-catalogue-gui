import { reduxForm } from 'redux-form';

import FormType from './form-type.component';
import { asyncValidateDatasetInvokePatch } from '../dataset-registration-form/formsLib/asyncValidateDatasetInvokePatch';

const config = {
  form: 'type',
  asyncValidate: asyncValidateDatasetInvokePatch
};

export const ConfiguredFormType = reduxForm(config)(FormType);
