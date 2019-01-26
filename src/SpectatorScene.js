import 'phaser';
import conn from './conn';
import { 
    MSG_TYPE_PLAYER_MOVE, MSG_TYPE_NEW_CONNECTION, CAMERA_GUTTER, MAX_SPEED,
    LOW_PLANT, LOW_LAMP, LOW_RUG, LOW_BOOKSHELF, LOW_COUCH, LOW_ANTENNA, LOW_TV, LOW_ART, 
    MID_PLANT, MID_LAMP, MID_RUG, MID_BOOKSHELF, MID_COUCH, MID_ANTENNA, MID_TV, MID_ART,
    HIGH_PLANT, HIGH_LAMP, HIGH_RUG, HIGH_BOOKSHELF, HIGH_COUCH, HIGH_ANTENNA, HIGH_TV, HIGH_ART, 
    MAP_HEIGHT, MAP_WIDTH
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
let items = null;

export default class Scene extends Phaser.Scene {
    preload() {
        this.load.image('arrow', 'assets/arrow.png');
        this.load.image('map', 'assets/island.png')

        // Load furniture images
        FURNITURE_NAMES.forEach(name => {
            this.load.image(name, `assets/${name}.png`);
        }); 
    }

    create() {
        // Camera and World creation
        let height = window.innerHeight / 2;
        let width = window.innerWidth / 2;
        
        this.add.image(0, 0, 'map').setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);

        // Player creation
        players.push(this.physics.add.sprite(MAP_WIDTH / 4, MAP_HEIGHT / 4, 'arrow'));
        players.push(this.physics.add.sprite(MAP_WIDTH / 4 * 3, MAP_HEIGHT / 4, 'arrow'));
        players.push(this.physics.add.sprite(MAP_WIDTH / 4, MAP_HEIGHT / 4 * 3, 'arrow'));
        players.push(this.physics.add.sprite(MAP_WIDTH / 4 * 3, MAP_HEIGHT / 4 * 3, 'arrow'));

        this.cameras.main.setSize(width - CAMERA_GUTTER, height - CAMERA_GUTTER);
        this.cameras.main.setPosition(0, 0);

        cameras.push(this.cameras.main);
        cameras.push(this.cameras.add(width + CAMERA_GUTTER, 0, width - CAMERA_GUTTER, height - CAMERA_GUTTER));
        cameras.push(this.cameras.add(0, height + CAMERA_GUTTER, width - CAMERA_GUTTER, height - CAMERA_GUTTER));
        cameras.push(this.cameras.add(width + CAMERA_GUTTER, height + CAMERA_GUTTER, width - CAMERA_GUTTER, height - CAMERA_GUTTER));

        let cameraCenterX = width / 2;
        let cameraCenterY = height / 2;

        items = this.physics.add.group();

        createItem(this, new Plant(LOW_FANCINESS), cameraCenterX + 100 + width, cameraCenterY);
        createItem(this, new Plant(MID_FANCINESS), cameraCenterX + 200 + width, cameraCenterY);
        createItem(this, new Plant(HIGH_FANCINESS), cameraCenterX + 100 + width, 200 + cameraCenterY);

        players.forEach(player => {
            this.physics.add.overlap(player, items, itemCollision);
        });

        players.forEach(player => {
            player.setCollideWorldBounds(true);
        });

        cameras.forEach((camera, index) => {
            camera.startFollow(players[index]);
            camera.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT); 
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

    }
}

function createItem(scene, furniture, x, y) {
    // create physics item
    let item = scene.physics.add.sprite(x, y, furniture.image);
    item.item = furniture;
    items.add(item);
}

function itemCollision(player, item) {
    console.log('collision')
    items.killAndHide(item);

    item.body.enable = false;
}