import 'phaser';
import conn from './conn';
import { MSG_TYPE_PLAYER_MOVE } from './constants';


export default class Scene extends Phaser.Scene {
    preload() {
        this.load.image('arrow', 'assets/arrow.png')
    }

    create() {
        this.joyStick = this.plugins.get('rexVirtualJoyStick').add(this, {x: 150, y: this.game.config.height - 150, radius: 100})
        this.joyStick.on('update', this.handleJoyStickState, this);

        conn.onmessage = function (msg) {
            msg = JSON.parse(msg.data);
            console.log(msg);
        };
    }

    update() {

    }

    handleJoyStickState() {
        let angle = this.joyStick.angle;
        let force = this.joyStick.force;
        force = force > 100 ? 100 : force;
        force /= 100.0
        console.log(force);

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