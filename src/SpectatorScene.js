import 'phaser';
import conn from './conn';
import { MSG_TYPE_PLAYER_MOVE, MSG_TYPE_NEW_CONNECTION, CAMERA_GUTTER, MAX_SPEED, MSG_TYPE_PLAYER_ATTACK } from './constants';
import Player from './classes/Player'

let currentPlayer = 0;
let numPlayers = 4;
let cameras = [];
let players = [];
let connectionIds = {};

export default class Scene extends Phaser.Scene {
    preload() {
        this.load.spritesheet('crab1', 'assets/crabs/bluecrab/bluecrabspritesheet.png', { frameWidth: 403, frameHeight: 320 });
        this.load.spritesheet('crab2', 'assets/crabs/greencrab/greencrabspritesheet.png', { frameWidth: 403, frameHeight: 320 });
        this.load.spritesheet('crab3', 'assets/crabs/purplecrab/purplecrabspritesheet.png', { frameWidth: 403, frameHeight: 320 });
        this.load.spritesheet('crab4', 'assets/crabs/yellowcrab/yellowcrabspritesheet.png', { frameWidth: 403, frameHeight: 320 });


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
        players.push(new Player(this.physics.add.sprite(cameraCenterX, cameraCenterY, 'crab1'),this));
        players.push(new Player(this.physics.add.sprite(cameraCenterX + width, cameraCenterY, 'crab2'),this));
        players.push(new Player(this.physics.add.sprite(cameraCenterX, cameraCenterY + height, 'crab3'),this));
        players.push(new Player(this.physics.add.sprite(cameraCenterX + width, cameraCenterY + height, 'crab4'),this));

        players.forEach(player => {
            player.sprite.setCollideWorldBounds(true);
        });

        cameras.forEach((camera, index) => {
            camera.startFollow(players[index].sprite);
            camera.setBounds(0, 0, width * 2, height * 2); 
        });

        conn.onmessage = function (msg) {
            msg = JSON.parse(msg.data);

            var player = null;
            switch (msg.type) {
                case MSG_TYPE_NEW_CONNECTION:
                    if (currentPlayer < numPlayers) {
                        connectionIds[msg.resourceId] = currentPlayer++;
                    }
                    break;
                case MSG_TYPE_PLAYER_MOVE:
                    let force = msg.joystick.force * MAX_SPEED;
                    let angle = msg.joystick.angle;

                    player = players[connectionIds[msg.resourceId]];

                    player.move(angle,force)
                    break;
                case MSG_TYPE_PLAYER_ATTACK:
                    player = players[connectionIds[msg.resourceId]];
                    player.attack(players);
                    
                    break;
            };
        };
    }

    update() {

    }
}