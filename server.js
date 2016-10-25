var express = require('express') || 'Anonymous';
var PORT = process.env.PORT || 3000;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var db = require('./db.js');



app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendCurrentUsers(socket){
	var info = clientInfo[socket.id];
	var users = [];
	if (typeof info === 'undefined'){
		return;
	}
	Object.keys(clientInfo).forEach(function(socketId){
		var userInfo = clientInfo[socketId];
		if (info.room === userInfo.room){
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: "System",
		text: "Current users: " + users.join(', '),
		timestamp: moment().valueOf()
	});
}

io.on('connection', function(socket) {
	console.log('user connected via socket.io');

	socket.on('disconnect', function(){
		var userData = clientInfo[socket.id];
		if (typeof clientInfo[socket.id] !== 'undefined'){
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: "System",
				text: userData.name + " has left.",
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function(req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: "System",
			text: req.name + " joined.",
			timestamp: moment().valueOf()
		});
	});

	socket.on('message', function(message) {
		console.log("message received " + message.text);

		if (message.text === "@currentUsers"){
			sendCurrentUsers(socket);
		} else if (message.name === "System"){
			message.timestamp = moment().valueOf();
			io.to(clientInfo[socket.id].room).emit('message', message);
		} else {
			message.timestamp = moment().valueOf();
			io.to(clientInfo[socket.id].room).emit('message', message);
			// TODO
			// Save Message To DB

		}

		
	});


});

db.sequelize.sync(

{
	force: true
}

).then(function() {
	http.listen(PORT, function() {
		console.log('Express server started on port ' + PORT);
	});
});

