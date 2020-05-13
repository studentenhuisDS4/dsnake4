import {JwtToken, LoginFormModel} from "src/components/auth/Models";
import ApiConnector from "src/components/global/ApiConnector";

const Auth = {
    authenticate(loginForm: LoginFormModel) {
        const data = {
            'username-or-email': loginForm.username,
            password: loginForm.password,
        };
        ApiConnector.connect('post', 'auth-jwt/', false, data)
            .then((result: any) => {
                const jwtToken: JwtToken = {
                    token: result!.token,
                    refresh: result!.refresh,
                };
                saveAuthToken(jwtToken);
            })
            .catch(error => {
                console.log('error logging in', error);
            });
    },
    checkLoginStatus() :boolean {
        return !!this.getAuthToken();
    },
    getAuthToken() :string {
        const token = localStorage.getItem('authToken');
        if (token) {
            return token;
        } else {
            return '';
        }
    },
};

function saveAuthToken(jwtToken: JwtToken) {
    localStorage.setItem('authToken', jwtToken.token);
    localStorage.setItem('refreshToken', jwtToken.refresh);
}

export default Auth;