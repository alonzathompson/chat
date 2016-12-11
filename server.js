var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	//this is where we are going to store the names to keep track of them
	nicknames = [];

server.listen(3000);
console.log('Successfully running on port 3000');

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html');
});
// i.o sockets is like the document.ready function in jquery
// all of the code is encapsulated inside that function
io.sockets.on('connection', function(socket){
	socket.on('new user', function(data, callback){
		//this means that if it is = to negative one when looking through the names
		// then the name does not exit in the nicknames array
		if(nicknames.indexOf(data) != -1){
			callback(false);
		} else {
			callback(true);
			
			//storing the nickname of each user which each user has its on socket with in the socket itself
			//adding nickname as a property onto the socket wchich has the data value
			socket.nickname = data;

			nicknames.push(socket.nickname);
			io.sockets.emit('usernames', nicknames);
		}
	});

	socket.on('send message', function(data){
		io.sockets.emit('new message', data);

	});
});