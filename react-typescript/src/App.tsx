import React, { Component } from 'react';
import './css/main.scss';
import config from './config/config.json';
import Chatbox from './components/chatbox/Chatbox';
import GameCanvas from './components/game/GameCanvas';
import Language from "./language/Language";
import SingleInputForm from "./components/global/SingleInputForm";

type AppProps = {};
type AppState = {
    activeLanguage: string,
    playerName: string,
};
export default class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.setPlayerName = this.setPlayerName.bind(this);
        document.title = config.siteName;

        this.state = {
            activeLanguage: Language.getLanguage(),
            playerName: '',
        };
    }

    setPlayerName(playerName: string) {
        this.setState({ playerName });
    }

    render() {
        return (
            <main>
                <div className="vh-100">
                    <div className="container h-100 py-5">
                        {this.state.playerName === '' ? (
                            <div className="w-100 h-100 d-flex justify-content-center align-items-center bg-seagreen-dark border border-2x border-dashed border-teal">
                                <div className="w-50">
                                    <SingleInputForm centerContent={true} inputPlaceholder="playerForm" submitValue={this.setPlayerName} />
                                </div>
                            </div>
                        ) : (
                                <div className="row h-100">
                                    <div className="col-md-8 h-100">
                                        <div className="card card-body border-0 h-100 bg-seagreen border border-2x border-dashed border-teal">
                                            <GameCanvas></GameCanvas>
                                        </div>
                                    </div>
                                    <div className="col-md-4 h-100">
                                        <Chatbox playerName={this.state.playerName} />
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </main>
        );
    }
}