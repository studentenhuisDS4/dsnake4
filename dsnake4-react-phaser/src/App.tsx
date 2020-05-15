import React, { Component } from 'react';
import './css/main.scss';
import config from './config/config.json';
import Chatbox from './components/chatbox/Chatbox';
import GameCanvas from './components/game/GameCanvas';
import Language from "./language/Language";
import SingleInputForm from "./components/global/SingleInputForm";
import AppState, {AppProps} from "./AppModel";
import {PlayerModel} from "src/components/chatbox/Models";
import HelperFunctions from "src/components/global/HelperFunctions";
import LoginForm from "src/components/auth/LoginForm";
import Auth from "src/components/auth/Auth";


export default class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.changePlayerName = this.changePlayerName.bind(this);
        this.initializeGame = this.initializeGame.bind(this);
        this.setLoginStatus = this.setLoginStatus.bind(this);
        document.title = config.siteName;

        const player = this.loadPlayer();
        this.state = {
            activeLanguage: Language.getLanguage(),
            initializeGame: player.name === '',
            isLoggedIn: Auth.checkLoginStatus(),
            player,
        };
    }

    changePlayerName() {
        this.setState({
            initializeGame: true,
        });
    }

    initializeGame(playerName: string) {
        const player = {
            uuid: HelperFunctions.generateUUID(),
            user_id: -1,
            nickname: playerName,
        };
        this.savePlayerName(player);
        this.setState({
            initializeGame: false,
            player,
        });
    }

    loadPlayer(): PlayerModel {
        let playerJson = localStorage.getItem('player');

        let player: PlayerModel = {
            uuid: HelperFunctions.generateUUID(),
            user_id: -1,
            nickname: '',
        };
        if (playerJson != null) {
            player = JSON.parse(playerJson);
        }
        return player;
    }

    savePlayerName(player: PlayerModel) {
        localStorage.setItem('player', JSON.stringify(player));
    }

    setLoginStatus(status: boolean) {
        this.setState({isLoggedIn: status});
    }

    render() {
        return (
            <main>
                <div className="vh-100">
                    <div className="container h-100 py-5">
                        {this.state.isLoggedIn ? (
                            this.state.initializeGame ? (
                                <div className="w-100 h-100 d-flex justify-content-center align-items-center bg-seagreen-dark border border-2x border-dashed border-teal">
                                    <div className="w-50">
                                        <SingleInputForm centerContent={true} inputPlaceholder="playerForm" submitValue={this.initializeGame} />
                                    </div>
                                </div>
                            ) : (
                                <div className="row h-100">
                                    <div className="col-md-8 h-100">
                                        <GameCanvas />
                                    </div>
                                    <div className="col-md-4 h-100">
                                        <Chatbox changePlayerName={this.changePlayerName} player={this.state.player} />
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="w-100 h-100 d-flex justify-content-center align-items-center bg-seagreen-dark border border-2x border-dashed border-teal">
                                <div className="w-50">
                                    <LoginForm loginCallback={this.setLoginStatus} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        );
    }
}
