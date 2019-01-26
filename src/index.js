import 'phaser';
import Scene from './Scene';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: new Scene()
};

var game = new Phaser.Game(config);
