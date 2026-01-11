import { z } from 'zod';

// Message Schema
export const MessageSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    content: z.string().min(10, 'Message must be at least 10 characters'),
    isRead: z.boolean().default(false),
    createdAt: z.coerce.date(),
});

export const CreateMessageSchema = MessageSchema.omit({
    id: true,
    isRead: true,
    createdAt: true,
});

export type Message = z.infer<typeof MessageSchema>;
export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;
