import React, { Component } from 'react';
import './css/main.scss';
import config from './config/config.json';
import Chatbox from './components/chatbox/Chatbox';
import GameCanvas from './components/game/GameCanvas';
import Language from "./language/Language";
import SingleInputForm from "./components/global/SingleInputForm";
import AppState, { AppProps } from "src/AppModel";

export default class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.changePlayerName = this.changePlayerName.bind(this);
        this.initializeGame = this.initializeGame.bind(this);
        document.title = config.siteName;

        this.state = {
            activeLanguage: Language.getLanguage(),
            initializeApp: true,
            playerName: '',
        };
    }

    changePlayerName() {
        this.setState({
            initializeApp: true,
        });
    }

    componentDidMount() {
        const playerName = this.loadPlayerName();
        this.setState({
            initializeApp: false,
            playerName,
        });
    }

    initializeGame(playerName: string) {
        if (playerName !== '') {
            this.savePlayerName(playerName);
            this.setState({
                initializeApp: false,
                playerName,
            });
        }
    }

    loadPlayerName() {
        const playerName = localStorage.getItem('playerName');
        return playerName != null ? playerName : '';
    }

    savePlayerName(playerName: string) {
        localStorage.setItem('playerName', playerName);
    }

    render() {
        return (
            <main>
                <div className="vh-100">
                    <div className="container h-100 py-5">
                        {this.state.initializeApp ? (
                            <div className="w-100 h-100 d-flex justify-content-center align-items-center bg-seagreen-dark border border-2x border-dashed border-teal">
                                <div className="w-50">
                                    <SingleInputForm centerContent={true} inputPlaceholder="playerForm" submitValue={this.initializeGame} />
                                </div>
                            </div>
                        ) : (
                            <div className="row h-100">
                                <div className="col-md-8 h-100">
                                    <div className="w-100 h-100 bg-black border border-2x border-dashed border-teal">
                                        <GameCanvas />
                                    </div>
                                </div>
                                <div className="col-md-4 h-100">
                                    <Chatbox changePlayerName={this.changePlayerName} playerName={this.state.playerName} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        );
    }
}
