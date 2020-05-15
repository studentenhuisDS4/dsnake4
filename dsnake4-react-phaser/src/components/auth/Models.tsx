/**
 * Date store model like user metadata
 */
export interface DataStoreModel {
    nickname: string,
}

export interface LoginFormModel {
    username: string,
    password: string
}

export interface LoginFormProps {
    loginCallback: (status: boolean) => void,
}

export default interface LoginFormState {
    isLoggedIn: boolean,
    isLoggingIn: boolean,
    loginForm: LoginFormModel,
    dataStoreForm: DataStoreModel,
}

export interface JwtToken {
    token: string,
    refresh: string,
}