import 'phaser';
import conn from './conn';
import {
    MSG_TYPE_PLAYER_MOVE, MSG_TYPE_NEW_CONNECTION, CAMERA_GUTTER, MAX_SPEED, MSG_TYPE_PLAYER_ATTACK,
    LOW_PLANT, LOW_LAMP, LOW_RUG, LOW_BOOKSHELF, LOW_COUCH, LOW_ANTENNA, LOW_TV, LOW_ART,
    MID_PLANT, MID_LAMP, MID_RUG, MID_BOOKSHELF, MID_COUCH, MID_ANTENNA, MID_TV, MID_ART,
    HIGH_PLANT, HIGH_LAMP, HIGH_RUG, HIGH_BOOKSHELF, HIGH_COUCH, HIGH_ANTENNA, HIGH_TV, HIGH_ART,
    MAP_HEIGHT, MAP_WIDTH, MSG_TYPE_CLOSE_CONNECTION, MAX_TICK
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
    LOW_LAMP, 
    LOW_RUG    , 
    LOW_BOOKSHELF, 
    LOW_COUCH  , 
    // LOW_ANTENNA, 
    LOW_TV     , 
    LOW_ART    , 
    MID_PLANT,
    // MID_LAMP   , 
    MID_RUG    , 
    // MID_BOOKSHELF, 
    // MID_COUCH  , 
    // MID_ANTENNA, 
    MID_TV     , 
    // MID_ART    , 
    HIGH_PLANT,
    // HIGH_LAMP  , 
    // HIGH_RUG   , 
    // HIGH_BOOKSHELF, 
    HIGH_COUCH , 
    // HIGH_ANTENNA, 
    // HIGH_TV    , 
    // HIGH_ART     
];
import Player from './classes/Player'
let connectionIds;
let numPlayers;
let currentPlayer;

let currentTick = 0;

let cameras = [];
let players = [];

let items = null;
let scoreboxes = [];

export default class Scene extends Phaser.Scene {
    preload() {
        this.load.spritesheet('crab1', 'assets/crabs/bluecrab/bluecrabspritesheet.png', { frameWidth: 403, frameHeight: 320 });
        this.load.spritesheet('crab2', 'assets/crabs/greencrab/greencrabspritesheet.png', { frameWidth: 403, frameHeight: 320 });
        this.load.spritesheet('crab3', 'assets/crabs/purplecrab/purplecrabspritesheet.png', { frameWidth: 403, frameHeight: 320 });
        this.load.spritesheet('crab4', 'assets/crabs/yellowcrab/yellowcrabspritesheet.png', { frameWidth: 403, frameHeight: 320 });

        this.load.image('arrow', 'assets/arrow.png');
        this.load.image('map', 'assets/island.png');

        this.load.audio('main', ['assets/audio/main.mp3']);
        this.load.audio('snip', ['assets/audio/snip.wav'])

        // Load furniture images
        FURNITURE_NAMES.forEach(name => {
            this.load.image(name, `assets/${name}.png`);
        });
    }

    create() {
        connectionIds = window.connectionIds;
        numPlayers = window.numPlayers;
        currentPlayer = window.currentPlayer;


        // Camera and World creation
        let height = window.innerHeight / 2;
        let width = window.innerWidth / 2;

        this.add.image(0, 0, 'map').setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);

        // Player creation
        console.log(currentPlayer);
        players.push(new Player(this.physics.add.sprite(MAP_WIDTH / 4, MAP_HEIGHT / 4, 'crab1'), this));
        cameras.push(this.cameras.main);

        players.push(new Player(this.physics.add.sprite(MAP_WIDTH / 4 * 3, MAP_HEIGHT / 4, 'crab2'), this));
        cameras.push(this.cameras.add(width + CAMERA_GUTTER, 0, width - CAMERA_GUTTER, height - CAMERA_GUTTER));

        if (currentPlayer >= 3) {
            players.push(new Player(this.physics.add.sprite(MAP_WIDTH / 4, MAP_HEIGHT / 4 * 3, 'crab3'), this));
            cameras.push(this.cameras.add(0, height + CAMERA_GUTTER, width - CAMERA_GUTTER, height - CAMERA_GUTTER));
        }
        
        if (currentPlayer >= 4) {
            players.push(new Player(this.physics.add.sprite(MAP_WIDTH / 4 * 3, MAP_HEIGHT / 4 * 3, 'crab4'), this));
            cameras.push(this.cameras.add(width + CAMERA_GUTTER, height + CAMERA_GUTTER, width - CAMERA_GUTTER, height - CAMERA_GUTTER));
        }


        this.cameras.main.setSize(width - CAMERA_GUTTER, height - CAMERA_GUTTER);
        this.cameras.main.setPosition(0, 0);

        
        
        
        

        let cameraCenterX = width / 2;
        let cameraCenterY = height / 2;

        items = this.physics.add.group();


        this.spawnItems(10);






        players.forEach(player => {
            this.physics.add.overlap(player.sprite, items, function (sprite, item) { itemCollision(player, item); });
        });

        players.forEach(player => {
            player.sprite.setDepth(9);
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
                    if (player) {
                        player.move(angle, force)
                    }



                    break;
                case MSG_TYPE_PLAYER_ATTACK:

                    player = players[connectionIds[msg.resourceId]];
                    if (player) {
                        player.attack(players);
                    }

                    break;
                case MSG_TYPE_CLOSE_CONNECTION:
                    if (connectionIds[msg.resourceId]) {
                        delete connectionIds[msg.resourceId];
                    }
                    break;
            };
        };

        this.music = this.sound.add('main');
        this.music.play();
    }

    update() {
        currentTick++;
        if (currentTick >= MAX_TICK) {
            currentTick = 0;
            this.spawnItems(1);
        }
    }

    spawnItems(num) {
        for (var i = 0; i < num; i++) {
            var fanciness = Math.random() * 10;
            var fancyLevel;
            if (fanciness > 8.5){
                fancyLevel = HIGH_FANCINESS;
            }else if (fanciness > 5) {
                fancyLevel = MID_FANCINESS;
            }else {
                fancyLevel = LOW_FANCINESS;
            }

            var type = Math.random() * 100;
            console.log(type);
            var item;

            switch(true){
                case (type > 95):
                    item = new Art(fancyLevel);
                    break;
                case (type > 86):
                    item = new Tv(fancyLevel);
                    break;
                case (type > 76):
                    item = new Antenna(fancyLevel);
                    break;
                case (type > 63):
                    item = new Couch(fancyLevel);
                    break;
                case (type > 49):
                    item = new Bookshelf(fancyLevel);
                    break;
                case (type > 34):
                    item = new Rug(fancyLevel);
                    break;
                case (type > 19):
                    item = new Lamp(fancyLevel);
                    break;
                default:
                    item = new Plant(fancyLevel);
            }

            createItem(this, item, (Math.random() * (MAP_WIDTH - 300)) + 150, (Math.random() * (MAP_HEIGHT - 300)) + 150);
        }
    }
}

function createItem(scene, furniture, x, y) {
    // create physics item
    let item = scene.physics.add.sprite(x, y, furniture.image);
    item.item = furniture;
    items.add(item);
    item.setDisplaySize(100, 100);

    item.body.setSize(100, 100);
    item.body.setOffset(250,250);
    
    item.setDepth(1);
  
}

function itemCollision(player, item) {


    //check player inventory for items of this type
    let removedItem = player.addToFurnitureInventory(item);
    console.log(removedItem);
    if (removedItem == item) {
        removeItem(item);
    } else if (removedItem && removedItem != item) {
        removeItem(item)
        //put removed item in scene behind player
        console.log("put item behind player");
    }

    updateScores();


}


function removeItem(item) {
    item.destroy();
}

function updateScores() {
    console.log(players[0].getScore());
    players.forEach((player, index) => {
        document.getElementById("scorenumber" + index).innerHTML = player.getScore();
    });
}

