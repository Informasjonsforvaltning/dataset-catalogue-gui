import React from "react";
import { shallow } from 'enzyme';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../../shallowWithStore';
import ProtectedRouteComponent, { ProtectedRoute } from "../../../src/containers/app-protected-route";
import user from '../../fixtures/user';

let defaultProps, store, wrapper, dispatch;

beforeEach(() => {
  dispatch = jest.fn();
  defaultProps = {
    dispatch,
    userItem: user.userItem,
    isFetchingUser: false
  }
  wrapper = shallow(<ProtectedRoute  {...defaultProps} />);
});

test('should render ProtectedRoute correctly', () => {
  expect(wrapper).toHaveLength(1);
});

test('should render FormAccessRightsSchema correctly', () => {
  const testState = {
    user
  };
  const store = createMockStore(testState)
  wrapper = shallowWithStore(<ProtectedRouteComponent />, store);
  expect(wrapper).toHaveLength(1);
});
