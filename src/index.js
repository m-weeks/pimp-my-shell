import 'phaser';
import Scene from './Scene';
import SpectatorScene from './SpectatorScene';
import VirtualJoyStickPlugin  from './plugins/rexvirtualjoystickplugin.min';
let scene;

if (window.spectator){
    scene = SpectatorScene;
}
else {
    scene = Scene;
}

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade'
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
