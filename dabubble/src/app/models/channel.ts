export interface Channel {
    id?: string;
    name: string;
    description?: string;
    createdBy: string;
    members: string[];
    isPrivate: boolean;
}
