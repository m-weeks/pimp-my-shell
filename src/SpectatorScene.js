import 'phaser';
import conn from './conn';
import { MSG_TYPE_PLAYER_MOVE, CAMERA_GUTTER, MAX_SPEED } from './constants';

let numPlayers = 4;
let cameras = [];

export default class Scene extends Phaser.Scene {
    preload() {
        this.load.image('arrow', 'assets/arrow.png');
        this.load.image('beach', 'assets/beach.jpeg');
    }

    create() {
        let height = this.game.config.height / 2;
        let width = this.game.config.width / 2;

        this.add.tileSprite(0, 0, width * 2, height * 2, 'beach');

        this.physics.world.setBounds(0, 0, width * 2, height * 2);

        this.cameras.main.setSize(width - CAMERA_GUTTER, height - CAMERA_GUTTER);
        this.cameras.main.setPosition(0, 0);

        cameras.push(this.cameras.main);
        cameras.push(this.cameras.add(width + CAMERA_GUTTER, 0, width - CAMERA_GUTTER, height - CAMERA_GUTTER));
        cameras.push(this.cameras.add(0, height + CAMERA_GUTTER, width - CAMERA_GUTTER, height - CAMERA_GUTTER));
        cameras.push(this.cameras.add(width + CAMERA_GUTTER, height + CAMERA_GUTTER, width - CAMERA_GUTTER, height - CAMERA_GUTTER));

        this.player = this.physics.add.sprite(100, 450, 'arrow');
        this.player.setCollideWorldBounds(true);
        
        let player = this.player;

        cameras.forEach(camera => {
            camera.startFollow(player);
            camera.setBounds(0, 0, width * 2, height * 2); 
        });

        conn.onmessage = function (msg) {
            msg = JSON.parse(msg.data);
            let force = msg.joystick.force * MAX_SPEED;
            let angle = msg.joystick.angle;

            player.setAngle(angle);
            player.setVelocityX(force * Math.cos(angle * Math.PI/180));
            player.setVelocityY(force * Math.sin(angle * Math.PI/180));
        };
    }

    update() {

    }
}