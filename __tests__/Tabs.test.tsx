import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Tabs from '../src/components/Tabs';

const tabs = [
  {key: 'ALL', label: 'All'},
  {key: 'ADMIN', label: 'Admin'},
  {key: 'MANAGER', label: 'Manager'},
];

test('renders all tabs', () => {
  const {getByText} = render(
    <Tabs tabs={tabs} activeIndex={0} onTabPress={() => {}} />,
  );

  expect(getByText('All')).toBeTruthy();
  expect(getByText('Admin')).toBeTruthy();
  expect(getByText('Manager')).toBeTruthy();
});

test('calls onTabPress when tab pressed', () => {
  const onTabPress = jest.fn();

  const {getByText} = render(
    <Tabs tabs={tabs} activeIndex={0} onTabPress={onTabPress} />,
  );

  fireEvent.press(getByText('Admin'));

  expect(onTabPress).toHaveBeenCalledWith(1);
});