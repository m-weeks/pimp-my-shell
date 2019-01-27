import 'phaser';
import Scene from './Scene';
import SpectatorScene from './SpectatorScene';
import VirtualJoyStickPlugin  from './plugins/rexvirtualjoystickplugin.min';
import { MAP_WIDTH, MAP_HEIGHT, MSG_TYPE_NEW_CONNECTION, MSG_TYPE_NEW_PLAYER } from './constants';
import conn from './conn';
let scene;

let wid;
let hei;
window.connectionIds = {};
window.numPlayers = 4;
window.currentPlayer = 0;
window.currentPlayerName = 0;
window.playerNames = {};

if (window.spectator){
    scene = SpectatorScene;
    wid = MAP_WIDTH;
    hei = MAP_HEIGHT;
}
else {
    scene = Scene;
    wid = window.innerWidth;
    hei = window.innerHeight;
    
}

var config = {
    type: Phaser.AUTO,
    width: wid,
    height: hei,

    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    input: {
        activePointers: 3
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

var game;

if (window.startGame) {
    startGame();
}

function startGame() {
    
    
    var a = document.querySelector(".lobby") ? document.querySelector(".lobby").style.display = "none" : '';
    a = document.querySelector("#scores") ? document.querySelector("#scores").style.display = "block" : '';

    game = new Phaser.Game(config);
}

window.onload = function () {

    var a = document.getElementById("startGame") ? document.getElementById("startGame").onclick = function () {startGame();} : '';

};

conn.onmessage = function (msg) {
    msg = JSON.parse(msg.data);
    
    var player = null;
    switch (msg.type) {
        
        case MSG_TYPE_NEW_CONNECTION:
            if (window.currentPlayer < window.numPlayers) {
                window.connectionIds[msg.resourceId] = window.currentPlayer++;
            }
            break;
        case MSG_TYPE_NEW_PLAYER:
            if (window.currentPlayerName < window.numPlayers) {
                window.playerNames[msg.resourceId] = msg.name;
                document.getElementById("name" + window.currentPlayerName).innerHTML = msg.name;
                window.currentPlayerName++;
            }
            break;
       
    };
};