import React, { Component } from 'react'
import Phaser from 'phaser'
import { IonPhaser, GameInstance } from '@ion-phaser/react'
import { GameCanvasProps, GameCanvasState } from "src/components/game/Models";
import { BootScene } from './Scenes';
import { SceneEvents } from './Events';

export default class GameCanvas extends Component<GameCanvasProps, GameCanvasState> {
    gameReady: boolean = false;

    constructor(props: GameCanvasProps) {
        super(props);

        this.state = {
            initialize: true,
            game: {
                title: 'DSnake4',
                type: Phaser.AUTO,
                scene: [BootScene],
                width: this.props.gameCanvasSize.width,
                height: this.props.gameCanvasSize.height,
                fps: {
                    target: 50,
                    forceSetTimeOut: true
                },
                backgroundColor: '#000000',
                callbacks: {
                    postBoot: (game) => {
                        this.gameReady = true;
                        this.onGameResize();
                        console.log("Game started");
                    }
                }
            } as GameInstance
        };
    }

    onGameResize() {
        const game = this.state.game.instance;
        if (this.gameReady && game != null) {
            game.events.emit(SceneEvents.UpdatedGameSize, {
                width: this.props.gameCanvasSize.width,
                height: this.props.gameCanvasSize.height
            });
        }
    }

    render() {
        const { initialize, game } = this.state;
        return (
            <IonPhaser game={game} initialize={initialize} />
        )
    }
}
