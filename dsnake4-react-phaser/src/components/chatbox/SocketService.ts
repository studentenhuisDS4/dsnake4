import io from 'socket.io-client';
import ChatMessage from './Models';
import { fromEvent, Observable } from 'rxjs';
import config from '../../config/config.json';

export class SocketService {
    private socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;

    public init (): SocketService {
        this.socket = io(config.chatboxServer);
        return this;
    }

    // send a message for the server to broadcast
    public send (message: ChatMessage): void {
        console.log('emitting message: ' + message);
        this.socket.emit('message', message);
    }

    // link message event to rxjs data source
    public onMessage (): Observable<ChatMessage> {
        return fromEvent(this.socket, 'message');
    }

    // disconnect - used when unmounting
    public disconnect (): void {
        this.socket.disconnect();
    }
}