import * as express from 'express';
import * as SocketIO from 'socket.io';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ChatEvent } from './constants';
import { ChatMessage, Auth, ChatMessageCreate } from './models/types';
import { createServer, Server, request, RequestOptions } from 'http';
import * as config from './config/config.json';
const cors = require('cors');

export class ChatServer {
    public static readonly PORT: number = 8080;
    private _app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    constructor() {
        this._app = express();
        this.port = process.env.PORT || ChatServer.PORT;
        this._app.use(cors());
        this._app.options('*', cors());
        this.server = createServer(this._app);
        this.initSocket();
        this.listen();
    }

    private initSocket(): void {
        this.io = SocketIO(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on(ChatEvent.CONNECT, (socket: any) => {
            console.log('Connected client on port %s.', this.port);

            socket.on(ChatEvent.MESSAGE, (secureMessage: Auth<ChatMessage>) => {
                if (secureMessage.token != null) {
                    const unverifiedMessage: Auth<ChatMessageCreate> = {
                        token: secureMessage.token,
                        chatMessage: {
                            message: secureMessage.chatMessage.message,
                            nickname: secureMessage.chatMessage.nickname
                        }
                    }
                    this.pushMessage(unverifiedMessage).then(() => {
                        console.log('[server](message): %s', JSON.stringify(secureMessage));
                        this.io.emit('message', secureMessage.chatMessage);
                    }, (error) => {
                        this.io.emit('failure', `Error while sending message: ${error}`);
                    });
                }
            });

            socket.on(ChatEvent.DISCONNECT, () => {
                console.log('Client disconnected');
            });
        });
    }

    get app(): express.Application {
        return this._app;
    }

    private pushMessage(authed_msg: Auth<ChatMessageCreate>): Promise<ChatMessage> {
        const url_base = config.ds4rebootServer;
        const url = url_base + '/api/v1/snake/chat/';
        if (!authed_msg.token) {
            console.warn("Auth token not found in given AuthChatMessage.");
            return Promise.resolve(null);
        }
        return axios
            .post(url, authed_msg.chatMessage, {
                headers: {
                    'Authorization': `Bearer ${authed_msg.token}`
                }
            })
            .then((res: AxiosResponse<ChatMessage>) => {
                if (res.status === 200) {
                    console.log('Token verified:', res.statusText);
                } else {
                    console.log('Error forwarding request');
                }
                return res.data;
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    console.log('Caught error:', error.response.status);
                    console.log(error.response.data, error.response.statusText);
                } else {
                    console.log('Couldnt connect to server: ', error.message);
                }
                return null;
            })
    }
}