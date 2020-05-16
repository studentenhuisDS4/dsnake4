import React, { Component } from 'react';
import LoginFormState, { LoginFormModel, LoginFormProps } from "./Models";
import SingleInputForm from "../global/SingleInputForm";
import LoadingSpinner from "../global/LoadingSpinner";
import Auth from "src/components/auth/Auth";

export default class LoginForm extends Component<LoginFormProps, LoginFormState> {
    constructor(props: LoginFormProps) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onSubmitUsername = this.onSubmitUsername.bind(this);
        this.onSubmitPassword = this.onSubmitPassword.bind(this);

        // Temporary data resulting in auth stored
        const loginForm: LoginFormModel = {
            username: '',
            password: ''
        };
        this.state = {
            isLoggedIn: false,
            isLoggingIn: false,
            loginForm
        }
    }

    handleLogin() {
        Auth.authenticate(this.state.loginForm)
            .then((success: boolean) => {
                this.setState({
                    isLoggedIn: success,
                    isLoggingIn: false
                }, () => {
                    if (success) {
                        this.props.loginCallback(success);
                    } else {
                        console.log("Auth not accepted.");
                        this.resetLogin();
                    }
                });
            }, (error) => {
                this.setState({
                    isLoggedIn: false,
                    isLoggingIn: false
                }, () => {
                    console.log("Auth failed.");
                    this.resetLogin();
                });
            });
    }

    onSubmitPassword(password: string) {
        if (password != null && password !== '') {
            const loginForm: LoginFormModel = this.state.loginForm;
            loginForm.password = password;
            this.setState({
                isLoggedIn: Auth.checkLoginStatus(),
                isLoggingIn: true,
                loginForm,
            }, () => {
                this.handleLogin();
            });
        }
    }

    onSubmitUsername(username: string) {
        if (username != null && username !== '') {
            const loginForm: LoginFormModel = this.state.loginForm;
            loginForm.username = username;
            this.setState({ loginForm });
        }
    }

    resetLogin() {
        this.setState({
            isLoggedIn: false,
            isLoggingIn: false,
            loginForm: {
                username: '',
                password: '',
            }
        });
    }

    render() {
        if (!this.state.isLoggedIn) {
            if (!this.state.isLoggingIn) {
                if (this.state.loginForm.username === '') {
                    return <SingleInputForm centerContent={true} inputPlaceholder="usernameForm" submitValue={this.onSubmitUsername} />
                } else {
                    return <SingleInputForm centerContent={true} inputPlaceholder="passwordForm" inputType="password" submitValue={this.onSubmitPassword} />
                }
            } else {
                return <LoadingSpinner loadingMessage="loginForm" />
            }
        } else {
            return <p>Logged in!</p>
        }
    }
}