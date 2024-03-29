<?php

require dirname(__DIR__) . '/vendor/autoload.php';
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Http\HttpServerInterface;

/**
 * GameEngine short summary.
 *
 * GameEngine description.
 *
 * @version 1.0
 * @author Graham
 */
class GameEngine implements MessageComponentInterface
{
    protected $clients;

    public function __construct(React\EventLoop\LoopInterface $loop)
    {
        $this->clients = new \SplObjectStorage;
        
        echo "server started\n";
    }

    /**
     * When a new connection is opened it will be passed to this method
     *
     * @param Ratchet\ConnectionInterface $conn The socket/connection that just connected to your application
     */
    function onOpen(Ratchet\ConnectionInterface $conn)
    {
        echo "connected: " . $conn->resourceId . "\n";
        $this->clients->attach($conn);


        foreach($this->clients as $client) {
            if ($conn->resourceId !== $client->resourceId){
                $connection_obj = array(
                    'type' => 'newConnection',
                    'resourceId' => $conn->resourceId
                );


                $client->send(json_encode($connection_obj));
            }else {

                $connection_obj = array(
                    'type' => 'yourId',
                    'resourceId' => $conn->resourceId
                );
                $client->send(json_encode($connection_obj));
            }
        }
    }

    /**
     * This is called before or after a socket is closed (depends on how it's closed).  SendMessage to $conn will not result in an error if it has already been closed.
     *
     * @param Ratchet\ConnectionInterface $conn The socket/connection that is closing/closed
     */
    function onClose(Ratchet\ConnectionInterface $conn)
    {
        echo $conn->resourceId . " has disconnected\n";

        $message = array(
            'resourceId' => $conn->resourceId,
            'type' => 'closeConnection'
        );
        
        foreach($this->clients as $client){
            if ($conn !== $client){
                $client->send(json_encode($message));
            }
        }

        $this->clients->detach($conn);
    }

    /**
     * If there is an error with one of the sockets, or somewhere in the application where an Exception is thrown,
     * the Exception is sent back down the stack, handled by the Server and bubbled back up the application through this method
     *
     * @param Ratchet\ConnectionInterface $conn
     * @param Exception $e
     */
    function onError(Ratchet\ConnectionInterface $conn, Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";
        $this->clients->detach($conn);
        $conn->close();
    }

    /**
     * Triggered when a client sends data through the socket
     *
     * @param Ratchet\ConnectionInterface $from The socket/connection that sent the message to your application
     * @param string $msg The message received
     */
    function onMessage(Ratchet\ConnectionInterface $from, $msg)
    {
        
        

        $message = json_decode($msg);
        
        $message->resourceId = $from->resourceId;

        if ($message->type == 'yourId'){
            $from->send(json_encode($message));
        } else {
        foreach($this->clients as $client){
            if ($from !== $client){
                $client->send(json_encode($message));
            }
        }
    }
    }
}