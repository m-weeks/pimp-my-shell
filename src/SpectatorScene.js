import 'phaser';
import conn from './conn';
import { MSG_TYPE_PLAYER_MOVE } from './constants';


export default class Scene extends Phaser.Scene {
    preload() {
        this.load.image('arrow', 'assets/arrow.png')
    }

    create() {

        this.player = this.physics.add.sprite(100, 450, 'arrow');
        this.player.setCollideWorldBounds(true);

        let player = this.player;

        conn.onmessage = function (msg) {
            msg = JSON.parse(msg.data);
            let force = msg.joystick.force;
            let angle = msg.joystick.angle;

            player.setAngle(angle);
            player.setVelocityX(force * Math.cos(angle * Math.PI/180));
            player.setVelocityY(force * Math.sin(angle * Math.PI/180));
        };
    }

    update() {

    }
}