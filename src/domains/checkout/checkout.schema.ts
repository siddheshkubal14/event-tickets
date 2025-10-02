import { z } from "zod";

// Reserve tickets
export const ReserveCheckoutSchema = z.object({
    eventId: z.string().uuid(),
    ticketTypeId: z.string().min(1),
    quantity: z.number().min(1, "Quantity must be at least 1")
});

// Confirm checkout
export const ConfirmCheckoutSchema = z.object({
    checkoutId: z.string().uuid()
});

// Cancel checkout
export const CancelCheckoutSchema = z.object({
    checkoutId: z.string().uuid()
});
