<?php

require dirname(__DIR__) . '/vendor/autoload.php';

use Ratchet\Server\IoServer;

use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\Session\SessionProvider;
use Symfony\Component\HttpFoundation\Session\Storage\Handler;
use Ratchet\Http\HttpServerInterface;
require "src\\GameEngine.php";



//$server = IoServer::factory(

//    new HttpServer(
//        new WsServer(
//            new GameEngine()
//        )
//    ),
//    8080
//);

//$server->run();

$loop = React\EventLoop\Factory::create();

$game = new GameEngine($loop);
$ip = '204.83.143.122';


$app = new Ratchet\App($ip, 44444, '0.0.0.0', $loop);
$app->route("/server", $game, array("*"));

$app->run();