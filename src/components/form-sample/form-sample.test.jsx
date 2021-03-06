import React from 'react';
import { shallow } from 'enzyme';
import FormSample from './form-sample.component';
import { sampleTypes } from './connected-form-sample.component';
import openlicenses from '../../../test/fixtures/openlicenses';
import samples from '../../../test/fixtures/samples';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { openLicenseItems } = openlicenses;
  defaultProps = {
    initialValues: {
      sample: sampleTypes(samples),
      openLicenseItems
    }
  };
  wrapper = shallow(<FormSample {...defaultProps} />);
});

test('should render FormSample correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
