import { JwtToken, LoginFormModel } from "src/components/auth/Models";
import ApiConnector from "src/components/global/ApiConnector";

export const AuthTokenStorageKey = 'authToken';
export const RefreshTokenStorageKey = 'refreshToken';
const Auth = {
    authenticate(loginForm: LoginFormModel): Promise<boolean> {
        const data = {
            'username-or-email': loginForm.username,
            password: loginForm.password,
        };
        return ApiConnector.connect('post', 'auth-jwt/', false, data)
            .then((result: any) => {
                const jwtToken: JwtToken = {
                    token: result!.token,
                    refresh: result!.refresh,
                };
                saveAuthToken(jwtToken);
                return true;
            })
            .catch(error => {
                console.log('error logging in', error);
                return false;
            });
    },
    checkLoginStatus(): boolean {
        return !!this.getAuthToken();
    },
    getAuthToken(): string {
        const token = localStorage.getItem(AuthTokenStorageKey);
        if (token) {
            return token;
        } else {
            return '';
        }
    },
};

function saveAuthToken(jwtToken: JwtToken) {
    localStorage.setItem(AuthTokenStorageKey, jwtToken.token);
    localStorage.setItem(RefreshTokenStorageKey, jwtToken.refresh);
}

export default Auth;