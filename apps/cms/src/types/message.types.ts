// Message API types

export interface Message {
    id: string;
    name: string;
    email: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

export interface MessagesResponse {
    messages: Message[];
}

// For creating new message (from contact form - public endpoint)
export interface CreateMessageInput {
    name: string;
    email: string;
    content: string;
}
