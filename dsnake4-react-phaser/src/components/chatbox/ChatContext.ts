import {Context, createContext} from 'react';
import { SocketService } from './SocketService';

// create new context
export const ChatContext: Context<SocketService> = createContext(new SocketService());