import { Ticket } from '@acme/shared-models';
import { BaseService } from './base.service';

export class TicketService extends BaseService {
  getTickets() {
    return this.axios.get<Ticket[]>('/tickets');
  }

  getTicket(ticketId: number) {
    return this.axios.get<Ticket>(`/tickets/${ticketId}`);
  }

  createTicket(description: string) {
    return this.axios.post<Ticket>(`/tickets`, { description });
  }

  assignTicket(ticketId: number, userId: number | null) {
    return this.axios.put<void>(`/tickets/${ticketId}/assign/${userId}`);
  }

  completeTicket(ticketId: number) {
    return this.axios.put<void>(`/tickets/${ticketId}/complete`);
  }

  reopenTicket(ticketId: number) {
    return this.axios.delete<void>(`/tickets/${ticketId}/complete`);
  }
}
