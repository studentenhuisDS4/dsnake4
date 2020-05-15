import * as express from 'express';
import * as SocketIO from 'socket.io';
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { ChatEvent } from './constants';
import { ChatMessage, Auth } from './models/types';
import { createServer, Server, request, RequestOptions } from 'http';
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
        const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTkwNjk4OTg4LCJqdGkiOiI4MTQxYjI0NzkyNTg0ZjRkYjdjZDZkYjIyMjFlYTAxYiIsInVzZXJfaWQiOjE0LCJ1c2VybmFtZSI6ImRhdmlkIiwiZW1haWwiOiJkYXZpZHp3YUBnbWFpbC5jb20ifQ.XmbWGlMNVwaUvic7Fqc5o-ZCD76ka347N-v2N1CTJBM';
        this.authUser(token);

        // this.getHighscores();
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on(ChatEvent.CONNECT, (socket: any) => {
            console.log('Connected client on port %s.', this.port);

            socket.on(ChatEvent.MESSAGE, (m: Auth<ChatMessage>) => {
                // this.getHighscores();
                this.pushMessage(m);
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            socket.on(ChatEvent.DISCONNECT, () => {
                console.log('Client disconnected');
            });
        });
    }

    get app(): express.Application {
        return this._app;
    }

    private authUser(token: string) {
        const url_base = 'http://localhost:8000';
        const url = url_base + '/api/v1/auth-jwt-verify/';
        axios
            .post(url, {
                'token': token
            })
            .then((res: AxiosResponse<any>) => {
                if (res.status === 200) {
                    console.log('Token verified:', res.statusText);
                } else {
                    console.log('Error forwarding request');
                }
                // console.log(`statusCode: ${res}`)
                // console.log(res.status)
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    console.log('Caught error:', error.response.status);
                    console.log(error.response.data);
                    // console.log(error.response.headers);
                } else {
                    console.log('Couldnt connect to server: ', error.message);
                }
            });
    }

    private pushMessage(authed_msg: Auth<ChatMessage>) {
        const url_base = 'http://localhost:8000';
        const url = url_base + '/api/v1/snake/chat/';
        axios
            .post(url, authed_msg.message, {
                headers: {
                    'Authorization': `Bearer ${authed_msg.token}`
                }
            })
            .then((res: AxiosResponse<any>) => {
                if (res.status === 200) {
                    console.log('Token verified:', res.statusText);
                } else {
                    console.log('Error forwarding request');
                }
                // console.log(`statusCode: ${res}`)
                // console.log(res.status)
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    console.log('Caught error:', error.response.status);
                    console.log(error.response.data);
                    // console.log(error.response.headers);
                } else {
                    console.log('Couldnt connect to server: ', error.message);
                }
            })
    }
}