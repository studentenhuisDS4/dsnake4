import React, { Component } from 'react'
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'
import { MenuScene } from './Scenes/MenuScene';
import {GameCanvasProps, GameCanvasState} from "src/components/game/Models";

export const FPS: number = 40;

export default class GameCanvas extends Component<GameCanvasProps, GameCanvasState> {
    constructor(props: GameCanvasProps) {
        super(props);

        this.state = {
            initialize: true,
            game: {
                title: 'DSnake4',
                type: Phaser.AUTO,
                scene: [MenuScene],
                width: this.props.gameCanvasSize.width,
                height: this.props.gameCanvasSize.height,
                fps: {
                    target: 50,
                    forceSetTimeOut: true
                },
                backgroundColor: '#000000',
            },
        };
    }

    render() {
        const { initialize, game } = this.state;
        return (
            <IonPhaser game={game} initialize={initialize} />
        )
    }
}