var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


const WebSocket = require('ws');
 
const wss = new WebSocket.Server({ port: 3001 });
 let connects = [];
wss.on('connection', function connection(ws) {
	 ws.send('something');
	connects.push(ws);
  ws.on('message', function incoming(msg) {
   // console.log( msg.msg);
      const msg2 = JSON.parse(msg)
    //  console.log( msg);
    //  console.log(msg2.msg);
      var msg1 = {
          "msg": msg2.msg,
          "sendPerson": msg2.sendPerson,
          "icon": md5(msg2.sendPerson)

      }
      //  ws.send(msg)
      // msg1 = JSON.stringify(msg1)
       connects.forEach((socket) => {
          socket.send(JSON.stringify(msg1))

       });
  });
 
 // ws.send('something');
});




module.exports = router;
