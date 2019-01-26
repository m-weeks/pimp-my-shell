import 'phaser';
import conn from './conn';
import { MSG_TYPE_PLAYER_MOVE } from './constants';

export default class Scene extends Phaser.Scene {
    preload() {
        this.load.image('arrow', 'assets/arrow.png');
        this.load.image('button', 'assets/button.png');
    }

    create() {
        let height = this.game.config.height;
        let width = this.game.config.width;
        this.joyStick = this.plugins.get('rexVirtualJoyStick').add(this, {x: 150, y: height - 150, radius: 100})
        this.joyStick.on('update', this.handleJoyStickState, this);

        this.button = this.add.sprite(width - 150, height - 150, 'button').setInteractive();
        this.button.on('pointerdown', function () {
            this.setAlpha(0.5);
        });
        this.button.on('pointerup', function () {
            this.setAlpha(1);
        });

        conn.onmessage = function (msg) {
            msg = JSON.parse(msg.data);
        };
    }

    update() {

    }

    handleJoyStickState() {
        let angle = this.joyStick.angle;
        let force = this.joyStick.force;
        force = force > 100 ? 100 : force;
        force /= 100.0

        let msg = {
            type: MSG_TYPE_PLAYER_MOVE,
            joystick: {
                angle: angle,
                force: force
            }
        };

        conn.send(JSON.stringify(msg));
    }
}