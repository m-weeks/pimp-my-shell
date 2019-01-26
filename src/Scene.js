import 'phaser';
import conn from './conn';
import { MSG_TYPE_PLAYER_MOVE, MSG_TYPE_PLAYER_ATTACK } from './constants';

export default class Scene extends Phaser.Scene {
    preload() {
        this.load.image('arrow', 'assets/arrow.png');
        this.load.image('button', 'assets/button.png');
    }

    create() {
        // this.input.addPointer();
        let height = this.game.config.height;
        let width = this.game.config.width;
        this.joyStick = this.plugins.get('rexVirtualJoyStick').add(this, {x: width / 4, y: height / 2, radius: 100})
        this.joyStick.on('update', this.handleJoyStickState, this);

        this.button = this.add.sprite(width - (width / 4), height /2, 'button').setInteractive();

        this.button.on('pointerdown', function () {
            this.setAlpha(0.5);
            let msg = {
                type: MSG_TYPE_PLAYER_ATTACK,
                attack: true
            };
            conn.send(JSON.stringify(msg));

            let button = this;

            setTimeout(() => {
                button.setAlpha(1);
            }, 200);
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