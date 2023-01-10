import { Ticket, User } from '@acme/shared-models';
import { Link } from 'react-router-dom';
import { StatusSelectField } from './StatusSelectField';
import { UserSelectField } from './UserSelectField';

interface TicketsListItemProps {
  users: User[];
  ticket: Ticket;
  assigneeChanged: (newAssigneeId: number | null) => Promise<void> | void;
  statusChanged: (newCompleted: boolean) => Promise<void> | void;
}

export function TicketsListItem({
  users,
  ticket: { id, description, completed, assigneeId },
  assigneeChanged,
  statusChanged,
}: TicketsListItemProps) {
  return (
    <tr>
      <td>{id}</td>
      <td>{description}</td>
      <td>
        <UserSelectField
          users={users}
          selectedUserId={assigneeId}
          onChange={assigneeChanged}
        />
      </td>
      <td>
        <StatusSelectField
          assigned={!!assigneeId}
          completed={completed}
          onChange={statusChanged}
        />
      </td>
      <td>
        <Link to={`/${id}`}>Edit</Link>
      </td>
    </tr>
  );
}
