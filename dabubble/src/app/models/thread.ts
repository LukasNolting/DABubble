export interface Thread {
    id?: string;
    name: string;
    description?: string;
    createdBy: string;
    messages: string[];
    messageDate: string;
    messageTime: string;
}
