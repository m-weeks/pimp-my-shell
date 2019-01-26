var conn = new WebSocket('ws://204.83.143.122:44444/server');

conn.onopen = function (e) {
    console.log('Connection Established!');
};



export default conn;