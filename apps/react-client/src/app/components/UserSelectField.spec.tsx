import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { User } from '@acme/shared-models';

import { UserSelectField } from './UserSelectField';

const emptyUsersList: User[] = [];
const usersList: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Chris' },
  { id: 4, name: 'Daisy' },
  { id: 5, name: 'Ed' },
];

it('renders an empty list', () => {
  const { asFragment, getAllByRole } = render(
    <UserSelectField
      users={emptyUsersList}
      selectedUserId={null}
      onChange={() => {}}
    />
  );

  console.log(asFragment());
  expect(asFragment).toMatchSnapshot();
  expect(getAllByRole('option').length).toEqual(1);
});

it('renders a list without selected user', () => {
  const { asFragment, getAllByRole } = render(
    <UserSelectField
      users={usersList}
      selectedUserId={null}
      onChange={() => {}}
    />
  );
  expect(asFragment()).toMatchSnapshot();
  expect(getAllByRole('option').length).toEqual(usersList.length + 1);
});

it('renders a list with selected user', () => {
  const { asFragment, getAllByRole } = render(
    <UserSelectField
      users={usersList}
      selectedUserId={usersList[2].id}
      onChange={() => {}}
    />
  );
  expect(asFragment()).toMatchSnapshot();
  expect(getAllByRole('option').length).toEqual(usersList.length + 1);
});
