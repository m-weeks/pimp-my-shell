import 'phaser';
import conn from './conn';
import { 
    MSG_TYPE_PLAYER_MOVE, MSG_TYPE_NEW_CONNECTION, CAMERA_GUTTER, MAX_SPEED, MSG_TYPE_PLAYER_ATTACK,
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
import Player from './classes/Player'
let currentPlayer = 0;
let numPlayers = 4;
let cameras = [];
let players = [];
let connectionIds = {};
let items = null;

export default class Scene extends Phaser.Scene {
    preload() {
        this.load.spritesheet('crab1', 'assets/crabs/bluecrab/bluecrabspritesheet.png', { frameWidth: 403, frameHeight: 320 });
        this.load.spritesheet('crab2', 'assets/crabs/greencrab/greencrabspritesheet.png', { frameWidth: 403, frameHeight: 320 });
        this.load.spritesheet('crab3', 'assets/crabs/purplecrab/purplecrabspritesheet.png', { frameWidth: 403, frameHeight: 320 });
        this.load.spritesheet('crab4', 'assets/crabs/yellowcrab/yellowcrabspritesheet.png', { frameWidth: 403, frameHeight: 320 });

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
        players.push(this.physics.add.sprite( 'arrow'));
        players.push(this.physics.add.sprite( 'arrow'));
        players.push(this.physics.add.sprite( 'arrow'));
        players.push(this.physics.add.sprite( 'arrow'));

        // Player creation
        players.push(new Player(this.physics.add.sprite(MAP_WIDTH / 4, MAP_HEIGHT / 4, 'crab1'),this));
        players.push(new Player(this.physics.add.sprite(MAP_WIDTH / 4 * 3, MAP_HEIGHT / 4, 'crab2'),this));
        players.push(new Player(this.physics.add.sprite(MAP_WIDTH / 4, MAP_HEIGHT / 4 * 3, 'crab3'),this));
        players.push(new Player(this.physics.add.sprite(MAP_WIDTH / 4 * 3, MAP_HEIGHT / 4 * 3, 'crab4'),this));

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
            player.sprite.setCollideWorldBounds(true);
        });

        cameras.forEach((camera, index) => {
            camera.startFollow(players[index].sprite);
            camera.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT); 
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