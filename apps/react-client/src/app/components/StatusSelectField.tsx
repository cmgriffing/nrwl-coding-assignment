import React from 'react';

interface StatusSelectFieldProps {
  onChange: (completed: boolean) => Promise<void> | void;
  completed: boolean;
  assigned: boolean;
}

export function StatusSelectField({
  onChange,
  completed,
  assigned,
}: StatusSelectFieldProps) {
  return (
    <select
      value={completed ? 'true' : undefined}
      onChange={(event) => {
        onChange(event.currentTarget.value === 'true');
      }}
    >
      <option value={undefined}>{assigned ? 'Pending' : 'Unassigned'}</option>
      <option value="true">Completed</option>
    </select>
  );
}
