import ApiConnector from "src/components/global/ApiConnector";
import { ChatMessage } from "src/../../chatbox-backend/src/models/types";

export const AuthTokenStorageKey = 'authToken';
export const RefreshTokenStorageKey = 'refreshToken';
const ChatService = {
    getChatHistory(): Promise<ChatMessage[]> {
        return ApiConnector.connect('get', 'snake/chat/', true)
            .then((result) => {
                return result as ChatMessage[];
            })
            .catch((error:any) => {
                console.log('error logging in', error);
                return [];
            });
    }
};


export default ChatService;