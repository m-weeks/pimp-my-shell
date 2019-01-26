import 'phaser';
import Scene from './Scene';
import VirtualJoyStickPlugin  from './plugins/rexvirtualjoystickplugin.min';

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
    scene: Scene
};

var game = new Phaser.Game(config);
