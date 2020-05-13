export interface LoginFormModel {
    username: string,
    password: string,
}

export interface LoginFormProps {
    loginCallback: (status: boolean) => void,
}
export default interface LoginFormState {
    isLoggedIn: boolean,
    isLoggingIn: boolean,
    loginForm: LoginFormModel,
}

export interface JwtToken {
    token: string,
    refresh: string,
}