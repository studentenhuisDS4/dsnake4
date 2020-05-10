import React, {Component, createRef} from 'react';
import './css/main.scss';
import config from './config/config.json';
import Chatbox from './components/chatbox/Chatbox';
import GameCanvas from './components/game/GameCanvas';
import Language from "./language/Language";
import SingleInputForm from "./components/global/SingleInputForm";
import AppState, {AppProps} from "src/AppModel";

export default class App extends Component<AppProps, AppState> {
    private canvasContainer = createRef<HTMLDivElement>();

    constructor(props: AppProps) {
        super(props);
        this.changePlayerName = this.changePlayerName.bind(this);
        this.initializeGame = this.initializeGame.bind(this);
        this.setGameCanvasSize = this.setGameCanvasSize.bind(this);
        document.title = config.siteName;

        const playerName = this.loadPlayerName();

        this.state = {
            activeLanguage: Language.getLanguage(),
            gameCanvasSize: {
                height: 0,
                width: 0,
            },
            initializeApp: true,
            initializeGame: false,
            playerName: '',
        };
    }

    changePlayerName() {
        this.setState({
            initializeApp: true,
            initializeGame: false,
        });
    }

    componentDidMount() {
        const playerName = this.loadPlayerName();
        this.setState({
            initializeApp: false,
            playerName,
        });
    }

    componentDidUpdate() {
        this.setGameCanvasSize();
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

    setGameCanvasSize() {
        console.log('canvas', this.canvasContainer);
        if (!this.state.initializeGame && this.canvasContainer.current != null) {
            this.setState({
                gameCanvasSize: {
                    height: this.canvasContainer.current!.clientHeight,
                    width: this.canvasContainer.current!.clientWidth,
                },
                initializeGame: true,
            });
        }
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
                                    <div className="w-100 h-100 bg-black border border-2x border-dashed border-teal" ref={this.canvasContainer}>
                                        {this.state.initializeGame && <GameCanvas gameCanvasSize={this.state.gameCanvasSize} />}
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