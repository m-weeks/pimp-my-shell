import 'phaser';
import conn from './conn';
import { 
    MSG_TYPE_PLAYER_MOVE, MSG_TYPE_NEW_CONNECTION, CAMERA_GUTTER, MAX_SPEED,
    LOW_PLANT, LOW_LAMP, LOW_RUG, LOW_BOOKSHELF, LOW_COUCH, LOW_ANTENNA, LOW_TV, LOW_ART, 
    MID_PLANT, MID_LAMP, MID_RUG, MID_BOOKSHELF, MID_COUCH, MID_ANTENNA, MID_TV, MID_ART,
    HIGH_PLANT, HIGH_LAMP, HIGH_RUG, HIGH_BOOKSHELF, HIGH_COUCH, HIGH_ANTENNA, HIGH_TV, HIGH_ART      
} from './constants';
import Plant from './classes/Plant';
import Lamp from './classes/Lamp';
import Rug from './classes/Rug';
import Bookshelf from './classes/Bookshelf';
import Couch from './classes/Couch';
import Antenna from './classes/Antenna';
import Tv from './classes/Tv';
import Art from './classes/Art';
import { LOW_FANCINESS, HIGH_FANCINESS, MID_FANCINESS } from './classes/Furniture';

let FURNITURE_NAMES = [
    LOW_PLANT, 
    // LOW_LAMP, 
    // LOW_RUG    , 
    // LOW_BOOKSHELF, 
    // LOW_COUCH  , 
    // LOW_ANTENNA, 
    // LOW_TV     , 
    // LOW_ART    , 
    MID_PLANT  , 
    // MID_LAMP   , 
    // MID_RUG    , 
    // MID_BOOKSHELF, 
    // MID_COUCH  , 
    // MID_ANTENNA, 
    // MID_TV     , 
    // MID_ART    , 
    HIGH_PLANT , 
    // HIGH_LAMP  , 
    // HIGH_RUG   , 
    // HIGH_BOOKSHELF, 
    // HIGH_COUCH , 
    // HIGH_ANTENNA, 
    // HIGH_TV    , 
    // HIGH_ART     
];

let currentPlayer = 0;
let numPlayers = 4;
let cameras = [];
let players = [];
let connectionIds = {};
let items = [];

export default class Scene extends Phaser.Scene {
    preload() {
        this.load.image('arrow', 'assets/arrow.png');
        this.load.image('beach', 'assets/beach.jpeg');

        // Load furniture images
        FURNITURE_NAMES.forEach(name => {
            this.load.image(name, `assets/${name}.png`);
        }); 
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
        players.push(this.physics.add.sprite(cameraCenterX + width, cameraCenterY, 'arrow'));
        players.push(this.physics.add.sprite(cameraCenterX, cameraCenterY + height, 'arrow'));
        players.push(this.physics.add.sprite(cameraCenterX + width, cameraCenterY + height, 'arrow'));

        let plant = new Plant(LOW_FANCINESS);

        items.push(this.physics.add.sprite(cameraCenterX + 100, cameraCenterY, LOW_PLANT));
       
        items[0].item = plant;
        this.physics.add.sprite(cameraCenterX + 100 + width, cameraCenterY, MID_PLANT);
        this.physics.add.sprite(cameraCenterX + 100, cameraCenterY + height, HIGH_PLANT);

        players.forEach(player => {
            player.setCollideWorldBounds(true);
        });

        cameras.forEach((camera, index) => {
            camera.startFollow(players[index]);
            camera.setBounds(0, 0, width * 2, height * 2); 
        });

        conn.onmessage = function (msg) {
            msg = JSON.parse(msg.data);

   
            switch (msg.type) {
                case MSG_TYPE_NEW_CONNECTION:
                    if (currentPlayer < numPlayers) {
                        connectionIds[msg.resourceId] = currentPlayer++;
                    }
                    break;
                case MSG_TYPE_PLAYER_MOVE:
                    let force = msg.joystick.force * MAX_SPEED;
                    let angle = msg.joystick.angle;

                    let player = players[connectionIds[msg.resourceId]];

                    player.setAngle(angle);
                    player.setVelocityX(force * Math.cos(angle * Math.PI/180));
                    player.setVelocityY(force * Math.sin(angle * Math.PI/180));
                    break;
            };
        };
    }

    update() {
        //check for collision with item
        players.forEach(player => {
            
        });
    }
}