import React from 'react';
import { User } from '@acme/shared-models';

interface UserSelectFieldProps {
  onChange: (userId: number | null) => Promise<void> | void;
  users: User[];
  selectedUserId: number | null;
}

const UNASSIGNED = 'Unassigned';

// Not entirely necessary to extract this to a component,
export function UserSelectField({
  onChange,
  users,
  selectedUserId,
}: UserSelectFieldProps) {
  return (
    <select
      value={selectedUserId || undefined}
      onChange={(event) => {
        let newAssigneeId = null;
        if (event.currentTarget.value !== UNASSIGNED) {
          newAssigneeId = Number(event.currentTarget.value);
        }
        onChange(newAssigneeId);
      }}
    >
      <option>{UNASSIGNED}</option>
      {users.map(({ id, name }) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </select>
  );
}
