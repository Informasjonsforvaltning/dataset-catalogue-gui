import validate from './form-accessRights.validations';
import datasets from '../../../test/fixtures/datasets';

it('should validate without errors', () => {
  const dataset = datasets.datasetItems._embedded.datasets[0];
  expect(validate(dataset)).toEqual({});
});
