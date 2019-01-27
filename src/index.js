import 'phaser';
import Scene from './Scene';
import SpectatorScene from './SpectatorScene';
import VirtualJoyStickPlugin  from './plugins/rexvirtualjoystickplugin.min';
import { MAP_WIDTH, MAP_HEIGHT, MSG_TYPE_NEW_CONNECTION, MSG_TYPE_NEW_PLAYER, GAME_LENGTH_SECS, MSG_TYPE_END_GAME } from './constants';
import conn from './conn';

let scene;
let currentSecs = GAME_LENGTH_SECS;
let wid;
let hei;
window.connectionIds = {};
window.numPlayers = 4;
window.currentPlayer = 0;
window.currentPlayerName = 0;
window.playerNames = {};
window.playerArray = [];

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
        default: 'arcade'
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
var timer;
var game;

if (window.startGame) {
    startGame();
}

function startGame() {
    
    if ( window.spectator){
        document.getElementById('audio').pause();
        timer = setInterval(function () {
            currentSecs--;
            document.getElementById("timer").innerHTML = getTimeString(currentSecs);
            if (currentSecs <= 0) {
                endGame();
            }
        },1000);
    }
    
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
                document.querySelector("#name" + window.currentPlayerName + " .name-text").innerHTML = msg.name;
                document.querySelector("#name" + window.currentPlayerName).style.display = "flex";
                document.getElementById("scorename" + window.currentPlayerName).innerHTML = msg.name;
                document.getElementById("score" + window.currentPlayerName).style.display = "flex";
                
                if ( window.currentPlayerName >= 1){
                    document.getElementById("startGame").style.display = "block";
                }

                window.currentPlayerName++;
            }
            break;
       
    };
};

function getTimeString(millis){
    var seconds = (millis) % 60 ;
    var minutes = Math.floor((millis / 60)) % 60;
    seconds = seconds > 9 ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
}

function endGame() {
    clearTimeout(timer);
    document.getElementById("scores").style.display = "none";
    document.getElementById("endgame").style.display = "flex";
    var highscore = 0;
    var winner = 0;
    for (var i = 0; i < 4; i++ ){
        if (parseInt(document.getElementById("scorenumber" + i).innerHTML) > highscore) {
            highscore = parseInt(document.getElementById("scorenumber" + i).innerHTML);
            winner = i;
        } 
    }
    document.getElementById("winner").innerHTML = document.getElementById("scorename" + winner).innerHTML
    document.getElementById("winscore").innerHTML = highscore;
    //TODO: Tell the phone it won
    // var winnerResourceId;
    // for (var id in game.scene.connectionIds){
    //     console.log(game.scene.connectionIds[id]);
    //     if (game.scene.connectionIds[id] == winner){
    //         winnerResourceId = id;
    //     }
    // };
    
    // let msg = {
    //     type: MSG_TYPE_END_GAME,
    //     winnerId:  winnerResourceId
    // };
    // conn.send(JSON.stringify(msg));

    let inventory = window.playerArray[winner].furnitureInventory;

    // TODO: Change to constants
    let types = ['couch', 'plant', 'lamp', 'rug', 'tv', 'bookshelf', 'antenna', 'art'];

    for(var i = 0; i < 8; i++) {
        let item = inventory[types[i]];
        if (item) {
            document.querySelector('.'+types[i]).src = 'assets/' + item.item.image + '.png';
        }
    }

    document.querySelector('#audio source').src = 'assets/audio/victory.mp3';
    document.querySelector('#audio').play();

    game.destroy(true);
}