import 'phaser';
import conn from './conn';
import { MSG_TYPE_PLAYER_MOVE, MSG_TYPE_PLAYER_ATTACK, MSG_TYPE_UPDATED_INVENTORY, MSG_TYPE_YOUR_ID, MSG_TYPE_END_GAME, MSG_TYPE_PLAYER_POWER, POWER_TYPE_SPEED } from './constants';

let myId = null;

export default class Scene extends Phaser.Scene {
    preload() {
        this.load.image('arrow', 'assets/arrow.png');
        this.load.image('snipbutton', 'assets/snipbutton.png');
        this.load.image('rocketbutton', 'assets/rocketbutton.png');
    }

    create() {
        let height = this.game.config.height;
        let width = this.game.config.width;
        this.joyStick = this.plugins.get('rexVirtualJoyStick').add(this, {x: width / 4, y: height * (2/3.0), radius: 100})
        this.joyStick.on('update', this.handleJoyStickState, this);

        this.snip = this.add.sprite(width - (width / 5), height * (2/3.0), 'snipbutton').setInteractive().setScale(0.5, 0.5);

        this.snip.on('pointerdown', function () {
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

        this.powerup = this.add.sprite(width - (width / 3), height / 3, 'rocketbutton').setInteractive().setScale(0.5, 0.5);

        this.powerup.on('pointerdown', function() {
            this.setAlpha(0.5);
            let msg = {
                type: MSG_TYPE_PLAYER_POWER,
                power: POWER_TYPE_SPEED
            }

            conn.send(JSON.stringify(msg));

            let button = this;

            setTimeout(() => {
                button.setAlpha(1);
            }, 200);
        })

        conn.onmessage = function (msg) {
            msg = JSON.parse(msg.data);
            switch (msg.type) {
                case MSG_TYPE_UPDATED_INVENTORY:
                    // if (myId == msg.playerId) {
                    //     console.log ('update my inventory')
                    //     console.log(msg.inventory)
                    // }
                    break;
                case MSG_TYPE_YOUR_ID:
                    myId = msg.resourceId;
                    break;
                case MSG_TYPE_END_GAME:
                    if (myId == msg.winnerId) {
                        console.log("I won");
                    }else {
                        console.log("I lost");
                    }
                    break;
            };
        };
        
        conn.send(JSON.stringify({type: MSG_TYPE_YOUR_ID}));

        let scene = this;
        window.addEventListener('resize', () => {
            width = window.innerWidth;
            height = window.innerHeight;
            console.log(scene);
            scene.game.resize(width, height);
            scene.physics.world.setBounds(0,0,width,height);
            scene.cameras.main.setViewport(0,0,width,height);
            scene.joyStick.setPosition(width / 4, height * (2/3.0));
            scene.joyStick.update();
            scene.snip.x = width - (width / 5);
            scene.snip.y = height * (2/3.0);
            scene.powerup.x = width - (width / 3);
            scene.powerup.y = height / 3;
        });
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