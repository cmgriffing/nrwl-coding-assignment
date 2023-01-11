import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Ticket } from '@acme/shared-models';
import { UserSelectField } from '../components/UserSelectField';
import { StatusSelectField } from '../components/StatusSelectField';
import { useFetchedUsers } from '../hooks/useFetchedUsers';
import { TicketService } from '../services/ticket.service';

export function TicketDetailsPage() {
  const { ticketId } = useParams();

  const [ticket, setTicket] = useState<Ticket>();
  const [fetchingTicket, setFetchingTicket] = useState(true);
  const [users] = useFetchedUsers();

  const ticketService = useRef(new TicketService()).current;

  useEffect(() => {
    if (ticketId) {
      ticketService
        .getTicket(Number(ticketId))
        .then((fetchedTicketResponse) => fetchedTicketResponse.data)
        .then(setTicket)
        .finally(() => setFetchingTicket(false));
    }
  }, [ticketId]);

  return (
    <div>
      <h2>Ticket Details</h2>

      {fetchingTicket && <h2>Fetching Ticket...</h2>}

      {!fetchingTicket && !ticket && <h2>Ticket Not Found</h2>}

      {!fetchingTicket && ticket && (
        <>
          <div>
            <h3>Assignee</h3>
            <div>
              <UserSelectField
                users={users}
                selectedUserId={ticket.assigneeId}
                onChange={async (newAssigneeId) => {
                  const oldAssigneeId = ticket.assigneeId;
                  ticket.assigneeId = newAssigneeId;
                  setTicket({ ...ticket });
                  await ticketService
                    .assignTicket(ticket.id, newAssigneeId)
                    .catch(() => {
                      // reset assignee
                      ticket.assigneeId = oldAssigneeId;
                      setTicket({ ...ticket });
                      // show toast error?
                    });
                }}
              />
            </div>
          </div>
          <div>
            <h3>Status</h3>
            <StatusSelectField
              assigned={!!ticket.assigneeId}
              completed={ticket.completed}
              onChange={async (newCompleted) => {
                const oldCompleted = ticket.completed;
                setTicket({ ...ticket, completed: newCompleted });
                let request;
                if (!newCompleted) {
                  request = ticketService.reopenTicket(ticket.id);
                } else {
                  request = ticketService.completeTicket(ticket.id);
                }
                await request.catch(() => {
                  // reset status in UI
                  setTicket({ ...ticket, completed: oldCompleted });
                  // show toast notification
                });
              }}
            />
          </div>
          <div>
            <h3>Description</h3>
            <p>{ticket.description}</p>
          </div>
        </>
      )}
    </div>
  );
}
