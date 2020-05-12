import React, { Component } from 'react';
import './css/main.scss';
import config from './config/config.json';
import Chatbox from './components/chatbox/Chatbox';
import GameCanvas from './components/game/GameCanvas';
import Language from "./language/Language";
import SingleInputForm from "./components/global/SingleInputForm";
import AppState, { AppProps } from "./AppModel";
import { ChatContext } from './components/chatbox/ChatContext';
import { SocketService } from './components/chatbox/SocketService';
import {PlayerModel} from "src/components/chatbox/Models";
import HelperFunctions from "src/components/global/HelperFunctions";

export default class App extends Component<AppProps, AppState> {
    private chat = new SocketService();

    constructor(props: AppProps) {
        super(props);
        this.changePlayerName = this.changePlayerName.bind(this);
        this.initializeGame = this.initializeGame.bind(this);
        document.title = config.siteName;

        const player = this.loadPlayer();
        this.state = {
            activeLanguage: Language.getLanguage(),
            initializeApp: player.name === '',
            player,
        };
    }

    changePlayerName() {
        this.setState({
            initializeApp: true,
        });
    }

    initializeGame(playerName: string) {
        const player = {
            id: HelperFunctions.generateUUID(),
            name: playerName,
        };
        this.savePlayerName(player);
        this.setState({
            initializeApp: false,
            player,
        });
    }

    loadPlayer() :PlayerModel {
        let playerJson = localStorage.getItem('player');

        let player :PlayerModel = {
            id: HelperFunctions.generateUUID(),
            name: '',
        };
        if (playerJson != null) {
            player = JSON.parse(playerJson);
        }
        return player;
    }

    savePlayerName(player: PlayerModel) {
        localStorage.setItem('player', JSON.stringify(player));
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
                                    <GameCanvas />
                                </div>
                                <div className="col-md-4 h-100">
                                    <ChatContext.Provider value={this.chat}>
                                        <Chatbox changePlayerName={this.changePlayerName} player={this.state.player} />
                                    </ChatContext.Provider>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        );
    }
}
