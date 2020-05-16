import * as express from 'express';
import * as SocketIO from 'socket.io';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ChatEvent } from './constants';
import { ChatMessage, Auth, ChatMessageCreate } from './models/types';
import { createServer, Server } from 'http';
import * as config from './config/config.json';
import { warn, info, error } from './utils/color';
const cors = require('cors');

export class ChatServer {
    public static readonly PORT: number = 8080;
    public static readonly API_URL: string = 'http://localhost:8000';
    private _app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;
    private api_url: string | number;

    constructor() {
        this._app = express();
        this.port = process.env.PORT || ChatServer.PORT;
        this.api_url = process.env.API_URL || config.ds4rebootServer || ChatServer.API_URL;
        console.log(this.api_url);
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
            warn(`Running server on port ${this.port}`);
        });

        this.io.on(ChatEvent.CONNECT, (socket: any) => {
            info(`- New Client connected on port ${this.port}`);
            // console.log('Connected client on port %s.', this.port);

            socket.on(ChatEvent.MESSAGE, (secureMessage: Auth<ChatMessage>) => {
                if (secureMessage.token != null) {
                    const unverifiedMessage: Auth<ChatMessageCreate> = {
                        token: secureMessage.token,
                        chatMessage: {
                            message: secureMessage.chatMessage.message,
                            nickname: secureMessage.chatMessage.nickname
                        }
                    }
                    this.pushMessage(unverifiedMessage).then((result) => {
                        warn(JSON.stringify(result));
                        info(`[server](message): ${JSON.stringify(secureMessage)}`)
                        
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
        const url_base = this.api_url;
        const url = url_base + '/api/v1/snake/chat/';
        if (!authed_msg.token) {
            warn("Auth token not found in given AuthChatMessage.");
            return Promise.resolve(null);
        }
        info(url);
        return axios
            .post(url, authed_msg.chatMessage, {
                headers: {
                    'Authorization': `Bearer ${authed_msg.token}`
                }
            })
            .then((res: AxiosResponse<ChatMessage>) => {
                if (res.status === 200) {
                    info('Token verified:', res.statusText);
                } else {
                    error('Error forwarding request');
                }
                return res.data;
            })
            .catch((errorResponse: AxiosError) => {
                if (errorResponse.response) {
                    error('Caught error:', errorResponse.response.status);
                    error(errorResponse.response.statusText);
                } else {
                    error('Couldnt connect to server: ', errorResponse.message);
                }
                return null;
            })
    }
}