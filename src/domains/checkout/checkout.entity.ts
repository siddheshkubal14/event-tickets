import { Checkout, CheckoutStatus } from "./checkout.interfaces";

export class CheckoutEntity implements Checkout {
    id: string;
    eventId: string;
    ticketTypeId: string;
    quantity: number;
    status: CheckoutStatus;
    expiresAt?: Date;

    constructor(checkout: Checkout) {
        this.id = checkout.id;
        this.eventId = checkout.eventId;
        this.ticketTypeId = checkout.ticketTypeId;
        this.quantity = checkout.quantity;
        this.status = checkout.status;
        this.expiresAt = checkout.expiresAt;
    }

    markCompleted() {
        this.status = CheckoutStatus.COMPLETED;
    }

    markExpired() {
        this.status = CheckoutStatus.EXPIRED;
    }
}
