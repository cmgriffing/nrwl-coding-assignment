import React, { useEffect, useRef, useState } from 'react';
import { Ticket } from '@acme/shared-models';
import { CreateTicketForm } from '../components/CreateTicketForm';
import { useFetchedUsers } from '../hooks/useFetchedUsers';

// I would prefer to set up some path aliases, but it seemed out of scope for this exercise
import { TicketService } from '../services/ticket.service';
import { TicketsListItem } from '../components/TicketsListItem';

export function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [fetchingTickets, setFetchingTickets] = useState(true);
  const [users] = useFetchedUsers();
  const ticketService = useRef(new TicketService()).current;

  useEffect(() => {
    ticketService
      .getTickets()
      .then((fetchedTicketsResponse) => fetchedTicketsResponse?.data)
      .then(setTickets)
      .catch(() => {
        // maybe spawn a toast notification of the failure
      })
      .finally(() => setFetchingTickets(false));
  }, []);

  return (
    <div>
      <div className="row">
        <h2>Tickets</h2>
      </div>
      <div>
        <h3>Create New Ticket</h3>
        <CreateTicketForm
          createTicket={async (description: string) => {
            // I am not married to this approach to catching the error. This is more of a demonstration and possible point of discussion, later (vs try/catch)
            const createdTicket = await ticketService
              .createTicket(description)
              .then((createdTicketResponse) => createdTicketResponse.data)
              .catch(() => {
                // possibly handle failure at this level instead of inside the form.
                // depends on how we report errors
              });

            if (createdTicket) {
              setTickets([...tickets, createdTicket]);
            }
          }}
        />
      </div>
      {fetchingTickets && <h3>Fetching tickets...</h3>}
      {!fetchingTickets && (
        <table>
          <thead>
            <th>ID</th>
            <th>Description</th>
            <th>Assignee</th>
            <th>Completed</th>
            <th></th>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <TicketsListItem
                users={users}
                ticket={ticket}
                assigneeChanged={async (newAssigneeId) => {
                  const oldAssigneeId = ticket.assigneeId;
                  ticket.assigneeId = newAssigneeId;
                  setTickets([...tickets]);
                  await ticketService
                    .assignTicket(ticket.id, newAssigneeId)
                    .catch(() => {
                      // reset assignee
                      ticket.assigneeId = oldAssigneeId;
                      setTickets([...tickets]);
                      // show toast error?
                    });
                }}
                statusChanged={async (newCompleted) => {
                  const oldCompleted = ticket.completed;
                  ticket.completed = newCompleted;
                  setTickets([...tickets]);
                  let request;
                  if (!newCompleted) {
                    request = ticketService.reopenTicket(ticket.id);
                  } else {
                    request = ticketService.completeTicket(ticket.id);
                  }
                  await request.catch(() => {
                    ticket.completed = oldCompleted;
                    setTickets([...tickets]);
                    // show toast notification
                  });
                }}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
