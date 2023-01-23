import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  URLSearchParamsInit,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { Ticket } from '@acme/shared-models';

// I would prefer to set up some path aliases, but it seemed out of scope for this exercise
import { TicketService } from '../services/ticket.service';
import { CreateTicketForm } from '../components/CreateTicketForm';
import { TicketsListItem } from '../components/TicketsListItem';
import { useFetchedUsers } from '../hooks/useFetchedUsers';

import styles from './TicketsPage.module.css';

interface TicketsPageSearchParams {
  status?: string;
  search?: string;
}

enum StatusSearchParam {
  Completed = 'completed',
  Pending = 'pending',
}

export function TicketsPage() {
  const [params, setSearchParams] = useSearchParams();
  const status = params.get('status') || '';
  const searchText = params.get('search') || '';
  const [users] = useFetchedUsers();

  // It could make sense to group these together into a reducer.
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [fetchingTickets, setFetchingTickets] = useState(true);
  const [filteredTickets, setFilteredTickets] = useState(tickets);
  const [statusFilter, setStatusFilter] = useState<StatusSearchParam>();

  const ticketService = useRef(new TicketService()).current;

  useEffect(() => {
    ticketService
      .getTickets()
      .then((fetchedTicketsResponse) => fetchedTicketsResponse?.data)
      .then(setTickets)
      .catch(() => {
        // maybe spawn a toast notification of the failure
        alert('Failure to fetch tickets.');
      })
      .finally(() => setFetchingTickets(false));
  }, []);

  useEffect(() => {
    const status = params.get('status');
    const searchText = params.get('search');

    let newFilteredTickets = tickets;
    if (status === StatusSearchParam.Completed) {
      setStatusFilter(StatusSearchParam.Completed);
      newFilteredTickets = tickets.filter(({ completed }) => completed);
    } else if (status === StatusSearchParam.Pending) {
      setStatusFilter(StatusSearchParam.Pending);
      newFilteredTickets = tickets.filter(({ completed }) => !completed);
    } else {
      setStatusFilter(undefined);
    }

    if (searchText) {
      newFilteredTickets = newFilteredTickets.filter((ticket) => {
        return ticket.description.indexOf(searchText) > -1;
      });
    }

    setFilteredTickets(newFilteredTickets);
  }, [tickets, params]);

  const updateStatusFilter = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      const status = event.currentTarget.value;
      const newSearchParams: TicketsPageSearchParams = {};
      if (searchText) {
        newSearchParams['search'] = searchText;
      }
      if (status) {
        newSearchParams['status'] = status;
      }
      setSearchParams({ ...newSearchParams }, { replace: true });
    },
    [params]
  );

  return (
    <div>
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
        <>
          <h3>Tickets</h3>
          <div>
            <div className="row">
              <label className={styles['radio']}>
                <input
                  type="radio"
                  name="status"
                  onChange={updateStatusFilter}
                  value={undefined}
                  checked={!statusFilter}
                />
                All
              </label>

              <label className={styles['radio']}>
                <input
                  type="radio"
                  name="status"
                  value={StatusSearchParam.Completed}
                  checked={statusFilter === StatusSearchParam.Completed}
                  onChange={updateStatusFilter}
                />
                Completed
              </label>

              <label className={styles['radio']}>
                <input
                  type="radio"
                  name="status"
                  value={StatusSearchParam.Pending}
                  checked={statusFilter === StatusSearchParam.Pending}
                  onChange={updateStatusFilter}
                />
                Pending
              </label>
            </div>
            <div className="row">
              <label>
                Search{' '}
                <input
                  name="description-search"
                  value={searchText}
                  onInput={(event) => {
                    setSearchParams(
                      { status, search: event.currentTarget.value },
                      {
                        replace: true,
                      }
                    );
                  }}
                />
              </label>
            </div>
          </div>

          {filteredTickets.length === 0 && <h2>No Tickets found.</h2>}
          {filteredTickets.length > 0 && (
            <table border={0} cellSpacing={0} cellPadding={0}>
              <thead>
                <th>ID</th>
                <th>Description</th>
                <th>Assignee</th>
                <th>Completed</th>
                <th></th>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
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
        </>
      )}
    </div>
  );
}
