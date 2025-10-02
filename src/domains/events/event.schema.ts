import { z } from "zod";

export const TicketTypeSchema = z.object({
    type: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
});

export const EventSchema = z.object({
    name: z.string().min(3),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    venue: z.string().min(2),
    ticketTypes: z.array(TicketTypeSchema),
});

export type EventInput = z.infer<typeof EventSchema>;
