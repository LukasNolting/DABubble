import { Injectable } from '@angular/core';
import { Firestore, collection, query,getDocs, collectionData, addDoc, where, onSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message, ThreadMessage } from '../../models/message';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private messagesSubject = new BehaviorSubject<Partial<Message>[]>([]);
  messages$: Observable<Partial<Message>[]> = this.messagesSubject.asObservable();  
  private threadMessagesSubject = new BehaviorSubject<ThreadMessage[]>([]);
  private threadchatStateSubject = new BehaviorSubject<boolean>(false); // Zustand des Thread-Chats
  threadMessages$: Observable<ThreadMessage[]> = this.threadMessagesSubject.asObservable();
  threadchatState$ = this.threadchatStateSubject.asObservable(); // Observable für den Thread-Chat-Zustand
  private messageIdSubject = new BehaviorSubject<string | null>(null);
  messageId$ = this.messageIdSubject.asObservable();
  constructor(private firestore: Firestore) {}

  // async loadMessagesForChannel(channelId: string): Promise<void> {
  //   const messagesRef = collection(this.firestore, `channels/${channelId}/messages`);
  //   const q = query(messagesRef);
  
  //   try {
  //     const querySnapshot = await getDocs(q);
  //     const messages: Message[] = querySnapshot.docs.map((doc) => {
  //       const data = doc.data();
  //       return {
  //         id: doc.id,
  //         createdBy: data['createdBy'] || 'Unbekannt',
  //         creatorName: data['creatorName'] || 'Unbekannt',
  //         creatorPhotoURL: data['creatorPhotoURL'] || '',
  //         isPrivate: data['isPrivate'] || false,
  //         message: data['message'] || '',
  //         timestamp: data['timestamp'] ? new Date(data['timestamp'].seconds * 1000) : new Date(),
  //         members: data['members'] || [],
  //         reactions: data['reactions'] || [],
  //         thread: data['thread'] || null,
  //       } as Message;
  //     });
  //     this.messagesSubject.next(messages);
  //     console.log('Nachrichten für Channel geladen im Service:', messages);
  //   } catch (error) {
  //     console.error('Fehler beim Laden der Nachrichten:', error);
  //     throw error;
  //   }
  // }

loadMessagesForChannel(channelId: string) {
  const messagesRef = collection(this.firestore, 'messages');
  const q = query(messagesRef, where('channelId', '==', channelId));

  onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id, // Firebase-Dokument-ID
        createdBy: data['createdBy'] || 'Unbekannt',
        creatorName: data['creatorName'] || 'Unbekannt',
        creatorPhotoURL: data['creatorPhotoURL'] || '',
        isPrivate: data['isPrivate'] || false,
        message: data['message'] || '',
        timestamp: data['timestamp'] ? new Date(data['timestamp'].seconds * 1000) : new Date(),
        members: data['members'] || [],
        reactions: data['reactions'] || [],
        thread: data['thread'] || null,
        docId: doc.id, // Hier die docId setzen
      } as Message;
    });
    this.messagesSubject.next(messages);
  });
}
  

  /**
   * Lädt Thread-Nachrichten einer bestimmten Nachricht und speichert sie lokal.
   * @param messageId ID der Parent-Nachricht
   */
  loadThreadMessages(messageId: string): void {
    const threadMessagesRef = collection(this.firestore, `messages/${messageId}/threadMessages`);
    const threadMessages$ = collectionData(threadMessagesRef, { idField: 'docId' }) as Observable<ThreadMessage[]>;
  
    threadMessages$.subscribe((threadMessages) => {
      const processedMessages = threadMessages.map((threadMessage) => {
        return {
          ...threadMessage,
          timestamp: (threadMessage.timestamp as any).seconds
            ? new Date((threadMessage.timestamp as any).seconds * 1000)
            : threadMessage.timestamp, // Behalte andere Werte bei
        };
      });
  
      this.threadMessagesSubject.next(processedMessages);
    });
  
    this.openThreadChat(); // Öffne den Thread-Chat
  }
  

  /**
   * Fügt eine neue Nachricht hinzu.
   * @param message Die Nachricht, die hinzugefügt werden soll
   */
  async addMessage(message: Message): Promise<void> {
    const messagesRef = collection(this.firestore, 'messages');
    try {
      await addDoc(messagesRef, message);
      console.log('Nachricht erfolgreich hinzugefügt:', message);
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Nachricht:', error);
      throw error;
    }
  }

  /**
   * Fügt eine neue Thread-Nachricht hinzu.
   * @param messageId ID der Parent-Nachricht
   * @param threadMessage Die Thread-Nachricht
   */
  async addThreadMessage(messageId: string, threadMessage: ThreadMessage): Promise<void> {
    const threadMessagesRef = collection(this.firestore, `messages/${messageId}/threadMessages`);
    try {
      await addDoc(threadMessagesRef, threadMessage);
      console.log('Thread-Nachricht erfolgreich hinzugefügt:', threadMessage);
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Thread-Nachricht:', error);
      throw error;
    }
  }

  /**
   * Öffnet den Thread-Chat.
   */
  openThreadChat(): void {
    
    this.threadchatStateSubject.next(true);
  }

  /**
   * Schließt den Thread-Chat.
   */
  closeThreadChat(): void {
    this.threadchatStateSubject.next(false);
  }


  
  setMessageId(messageId: string): void {
    this.messageIdSubject.next(messageId);
    // console.log('Message-ID gesetzt:', messageId);
  }
}
