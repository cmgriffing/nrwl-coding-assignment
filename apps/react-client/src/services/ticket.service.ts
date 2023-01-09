import { Ticket } from '@acme/shared-models';
import { BaseService } from './base.service';

export class TicketService extends BaseService {
  getTickets() {
    return this.axios.get<Ticket[]>('/tickets');
  }

  getTicket(ticketId: string) {
    this.axios.get<Ticket>(`/tickets/${ticketId}`);
  }

  assignTicket(ticketId: string, userId: string) {
    this.axios.put<void>(`/tickets/${ticketId}/assign/${userId}`);
  }

  completeTicket(ticketId: string) {
    this.axios.put<void>(`/tickets/${ticketId}/complete`);
  }

  reopenTicket(ticketId: string) {
    this.axios.delete<void>(`/tickets/${ticketId}/complete`);
  }
}
