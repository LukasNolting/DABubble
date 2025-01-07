export interface Message {
    docId?: string; // Firestore-Dokument-ID (optional, falls nicht von Firebase bereitgestellt)
    channelId?: string; // Zugehöriger Kanal
    createdBy: string; // User-ID des Erstellers
    creatorName: string; // Anzeigename des Erstellers
    creatorPhotoURL: string; // Anzeige URL des Avatars
    isPrivate: boolean; // Gibt an, ob die Nachricht privat ist
    recipientId?: string; // Zielbenutzer-ID, falls privat
    description?: string; // Optionaler Beschreibungstext
    members: string[]; // Mitglieder (z. B. Nutzer-IDs im Thread oder Kanal)
    timestamp: string | Date; // ISO-8601-Zeitstempel oder Date-Objekt
    reactions: Reaction[]; // Array von Reaktionen
    message: string; // Nachrichtentext
}


export interface ThreadMessage {
    docId?: string; // Firestore-Dokument-ID (optional, falls nicht von Firebase bereitgestellt)
    createdBy: string; // User-ID des Erstellers
    creatorName: string; // Anzeigename des Erstellers
    creatorPhotoURL: string; // Anzeige URL des Avatars
    timestamp: string | Date; // ISO-8601-Zeitstempel oder Date-Objekt
    reactions: Reaction[]; // Array von Reaktionen
    message: string; // Nachrichtentext
}

export interface Reaction {
    emoji: string; // Das verwendete Emoji
    userId: string; // ID des Nutzers, der reagiert hat
}