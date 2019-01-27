import { MSG_TYPE_NEW_PLAYER } from "./constants";

var conn
if ( window.connect){
     conn = new WebSocket('ws://204.83.143.122:44444/server');

    conn.onopen = function (e) {
        console.log('Connection Established!');
        if (!window.spectator) {
            var name = getCookie('name');

            var msg = {
                type: MSG_TYPE_NEW_PLAYER,
                name: name
            }

            conn.send(JSON.stringify(msg));
        }
    };

}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

export default conn;