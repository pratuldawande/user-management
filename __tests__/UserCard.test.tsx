import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import UserCard from '../src/components/UserCard';

const user = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'ADMIN',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

test('renders user details', () => {
  const {getByText} = render(
    <UserCard user={user} onPress={() => {}} />,
  );

  expect(getByText('John Doe')).toBeTruthy();
  expect(getByText('john@example.com')).toBeTruthy();
});

test('calls onPress when card pressed', () => {
  const onPress = jest.fn();

  const {getByText} = render(
    <UserCard user={user} onPress={onPress} />,
  );

  fireEvent.press(getByText('John Doe'));

  expect(onPress).toHaveBeenCalled();
});