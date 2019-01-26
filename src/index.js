import 'phaser';
import Scene from './Scene';
import SpectatorScene from './SpectatorScene';
import VirtualJoyStickPlugin  from './plugins/rexvirtualjoystickplugin.min';
import { MAP_WIDTH, MAP_HEIGHT } from './constants';
let scene;

let wid;
let hei;

if (window.spectator){
    scene = SpectatorScene;
    wid = MAP_WIDTH;
    hei = MAP_HEIGHT;
}
else {
    scene = Scene;
    wid = window.innerWidth;
    hei = window.innerWidth;
}

var config = {
    type: Phaser.AUTO,
    width: wid,
    height: hei,

    physics: {
        default: 'arcade',
        arcade:{
            debug: true
        }
    },
    plugins: {
        global: [{
            key: 'rexVirtualJoyStick',
            plugin: VirtualJoyStickPlugin,
            start: true
        }]
    },
    scene: scene
};

var game = new Phaser.Game(config);

