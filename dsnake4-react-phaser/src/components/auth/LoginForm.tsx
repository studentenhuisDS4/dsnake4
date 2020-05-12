import React, {Component} from 'react';
import LoginFormState, {LoginFormModel, LoginFormProps} from "./Models";
import SingleInputForm from "../global/SingleInputForm";
import LoadingSpinner from "../global/LoadingSpinner";

export default class LoginForm extends Component<LoginFormProps, LoginFormState> {
    constructor(props: LoginFormProps) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onSubmitUsername = this.onSubmitUsername.bind(this);
        this.onSubmitPassword = this.onSubmitPassword.bind(this);

        const loginForm :LoginFormModel = {
            username: '',
            password: '',
        };
        this.state = {
            isLoggedIn: false,
            isLoggingIn: false,
            loginForm,
        }
    }

    handleLogin() {
        this.props.loginCallback(true);
    }

    onSubmitPassword(password: string) {
        if (password != null && password !== '') {
            const loginForm :LoginFormModel = this.state.loginForm;
            loginForm.password = password;
            this.setState({
                isLoggedIn: true,
                isLoggingIn: true,
                loginForm,
            }, () => {
                this.handleLogin();
            });
        }
    }

    onSubmitUsername(username: string) {
        if (username != null && username !== '') {
            const loginForm :LoginFormModel = this.state.loginForm;
            loginForm.username = username;
            this.setState({loginForm});
        }
    }

    render() {
        if (!this.state.isLoggedIn) {
            if (!this.state.isLoggingIn) {
                if (this.state.loginForm.username === '') {
                    return <SingleInputForm centerContent={true} inputPlaceholder="usernameForm" submitValue={this.onSubmitUsername} />
                } else {
                    return <SingleInputForm centerContent={true} inputPlaceholder="passwordForm" submitValue={this.onSubmitPassword} />
                }
            } else {
                return <LoadingSpinner loadingMessage="loginForm" />
            }
        } else {
            return <p>Logged in!</p>
        }
    }
}