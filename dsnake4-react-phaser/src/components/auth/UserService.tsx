import ApiConnector from "src/components/global/ApiConnector";
import { User } from './Api.Model';

export const AuthTokenStorageKey = 'authToken';
export const RefreshTokenStorageKey = 'refreshToken';
const UserService = {
    getUser(): Promise<number | null | undefined> {
        return ApiConnector.connect('get', 'user/', true)
            .then((result) => {
                const response = result as User;
                console.log('response api', response);
                return response.id;
            })
            .catch((error: any) => {
                console.log('error logging in', error);
                return null;
            });
    }
};


export default UserService;