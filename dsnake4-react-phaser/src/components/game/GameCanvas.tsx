import React, {Component, createRef} from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import GameCanvasSize, { GameCanvasProps, GameCanvasState } from "src/components/game/Models";
import { BootScene } from './Scenes';
import { SceneEvents } from './Events';

export default class GameCanvas extends Component<GameCanvasProps, GameCanvasState> {
    gameReady: boolean = false;
    canvasContainer = createRef<HTMLDivElement>();

    constructor(props: GameCanvasProps) {
        super(props);
        this.setGameCanvasSize = this.setGameCanvasSize.bind(this);

        const canvasSize: GameCanvasSize = {
            height: 0,
            width: 0,
        };

        this.state = {
            initialize: true,
            loadGame: false,
            game: {
                title: 'DSnake4',
                type: Phaser.AUTO,
                scene: [BootScene],
                ...canvasSize,
                fps: {
                    target: 50,
                    forceSetTimeOut: true
                },
                backgroundColor: '#000000',
                callbacks: {
                    postBoot: (game) => {
                        this.gameReady = true;
                        this.onCanvasSizeChange(canvasSize);
                    }
                }
            },
        };

        window.addEventListener('resize', this.setGameCanvasSize);
    }

    componentDidMount() {
        this.setGameCanvasSize();
    }

    onCanvasSizeChange(canvasSize: GameCanvasSize) {
        const game = this.state.game.instance;
        if (this.gameReady && game != null) {
            game.events.emit(SceneEvents.UpdatedGameSize, {
                ...canvasSize,
            });
        }
    }

    setGameCanvasSize() {
        if (this.canvasContainer.current != null) {
            const canvasSize: GameCanvasSize = {
                height: this.canvasContainer.current!.clientHeight,
                width: this.canvasContainer.current!.clientWidth,
            };
            this.setState({
                game: {
                    ...this.state.game,
                    ...canvasSize,
                },
                loadGame: true,
            }, () => this.onCanvasSizeChange(canvasSize));
        }
    }

    render() {
        const { initialize, game } = this.state;
        return (
            <div className="w-100 h-100 bg-black border border-2x border-dashed border-teal" ref={this.canvasContainer}>
                {this.state.loadGame && <IonPhaser game={game} initialize={initialize} />}
            </div>
        );
    }
}
