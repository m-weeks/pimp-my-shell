import 'phaser';
import conn from './conn';
import { MSG_TYPE_PLAYER_MOVE, CAMERA_GUTTER, MAX_SPEED } from './constants';

let numPlayers = 4;
let cameras = [];
let players = [];

export default class Scene extends Phaser.Scene {
    preload() {
        this.load.image('arrow', 'assets/arrow.png');
        this.load.image('beach', 'assets/beach.jpeg');
    }

    create() {
        // Camera and World creation
        let height = this.game.config.height / 2;
        let width = this.game.config.width / 2;

        this.add.tileSprite(0, 0, width * 4, height * 4, 'beach'); //test code
        this.physics.world.setBounds(0, 0, width * 2, height * 2);

        this.cameras.main.setSize(width - CAMERA_GUTTER, height - CAMERA_GUTTER);
        this.cameras.main.setPosition(0, 0);

        cameras.push(this.cameras.main);
        cameras.push(this.cameras.add(width + CAMERA_GUTTER, 0, width - CAMERA_GUTTER, height - CAMERA_GUTTER));
        cameras.push(this.cameras.add(0, height + CAMERA_GUTTER, width - CAMERA_GUTTER, height - CAMERA_GUTTER));
        cameras.push(this.cameras.add(width + CAMERA_GUTTER, height + CAMERA_GUTTER, width - CAMERA_GUTTER, height - CAMERA_GUTTER));

        let cameraCenterX = width / 2;
        let cameraCenterY = height / 2;

        // Player creation
        players.push(this.physics.add.sprite(cameraCenterX, cameraCenterY, 'arrow'));
        players.push(this.physics.add.sprite(cameraCenterX, cameraCenterY + height, 'arrow'));
        players.push(this.physics.add.sprite(cameraCenterX + width, cameraCenterY, 'arrow'));
        players.push(this.physics.add.sprite(cameraCenterX + width, cameraCenterY + height, 'arrow'));

        players.forEach(player => {
            player.setCollideWorldBounds(true);
        });

        cameras.forEach((camera, index) => {
            camera.startFollow(players[index]);
            camera.setBounds(0, 0, width * 2, height * 2); 
        });

        conn.onmessage = function (msg) {
            msg = JSON.parse(msg.data);
            let force = msg.joystick.force * MAX_SPEED;
            let angle = msg.joystick.angle;

            players.forEach(player => {
                player.setAngle(angle);
                player.setVelocityX(force * Math.cos(angle * Math.PI/180));
                player.setVelocityY(force * Math.sin(angle * Math.PI/180));
            });
        };
    }

    update() {

    }
}