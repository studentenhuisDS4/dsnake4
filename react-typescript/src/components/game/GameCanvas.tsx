import React, { Component } from 'react'
import Phaser from 'phaser'
import { IonPhaser, GameInstance } from '@ion-phaser/react'
import { MenuScene } from './Scenes/MenuScene';
import { HubScene } from './Scenes/HubScene';
import { SW, SH } from './GameConfig';

export const FPS: number = 40;

export default class GameCanvas extends Component {
    state = {
        initialize: true,
        game: {
            title: 'DSnake4',
            type: Phaser.AUTO,
            scene: [MenuScene],
            width: SW,
            height: SH + 50,
            fps: {
                target: 50,
                forceSetTimeOut: true
            },
            backgroundColor: '#000000',
        } as GameInstance,
    }
    render() {
        const { initialize, game } = this.state;
        return (
            <IonPhaser game={game} initialize={initialize} />
        )
    }
}