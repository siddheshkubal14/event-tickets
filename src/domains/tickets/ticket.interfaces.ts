export interface TicketType {
  id: string;
  name: string;
  price: number;
  capacity: number;
  remaining: number;
}

export type TicketTypeId = "VIP" | "General" | "Standard";

export class TicketingError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
  }
}