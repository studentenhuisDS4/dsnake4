import io from 'socket.io-client';
import { ChatMessageModel } from './Models';
import { Player, ChatMessage } from 'src/../../chatbox-backend/src/models/types';
import { Auth } from 'src/../../chatbox-backend/src/models/types';
import { fromEvent, Observable } from 'rxjs';
import config from '../../config/config.json';
import { AuthTokenStorageKey } from '../auth/Auth';

export class SocketService {
    private socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;

    public init(): SocketService {
        this.socket = io(config.chatboxServer);
        return this;
    }

    // send a message for the server to broadcast
    public send(message: ChatMessageModel): void {
        const storedToken = this.loadToken();
        if (storedToken != null) {
            const authChatMessage: Auth<ChatMessage> = {
                token: storedToken,
                chatMessage: message
            };
            this.socket.emit('message', authChatMessage);
        } else {
            throw new Error("Auth token not set. Cant emit message.");
        }
    }

    // link message event to rxjs data source
    public onMessage(): Observable<ChatMessageModel> {
        return fromEvent(this.socket, 'message');
    }

    // disconnect - used when unmounting
    public disconnect(): void {
        this.socket.disconnect();
    }

    private loadToken(): string | null {
        return localStorage.getItem(AuthTokenStorageKey);
    }
}