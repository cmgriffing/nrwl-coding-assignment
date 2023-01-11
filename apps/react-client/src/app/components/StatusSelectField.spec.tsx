import React from 'react';

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { StatusSelectField } from './StatusSelectField';

it('renders a Pending state', () => {
  const { asFragment, getByRole } = render(
    <StatusSelectField completed={false} assigned={false} onChange={() => {}} />
  );

  expect(asFragment).toMatchSnapshot();
  expect(
    (getByRole('option', { name: 'Unassigned' }) as HTMLOptionElement).selected
  ).toEqual(true);
});

it('renders an Assigned state', () => {
  const { asFragment, getByRole } = render(
    <StatusSelectField completed={false} assigned={true} onChange={() => {}} />
  );
  expect(asFragment()).toMatchSnapshot();
  expect(
    (getByRole('option', { name: 'Pending' }) as HTMLOptionElement).selected
  ).toEqual(true);
});

it('renders a Completed state', () => {
  const { asFragment, getByRole } = render(
    <StatusSelectField completed={true} assigned={false} onChange={() => {}} />
  );
  expect(asFragment()).toMatchSnapshot();
  expect(
    (getByRole('option', { name: 'Completed' }) as HTMLOptionElement).selected
  ).toEqual(true);
});
