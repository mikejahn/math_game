//setup Dependencies
var connect = require('connect'),
 	express = require('express'),
	_ = require('underscore'),
	$ = require('jquery');
//setup app
var app = express();

//setup handelbars and static app
app.set('views', __dirname + '/templates');
app.set('view engine', "html");
app.engine('html', require('hbs').__express);
app.get("/", function(req, res){
    res.render("index");
});

//setup assets
app.use("/scripts", express.static(__dirname + '/public/scripts'));
//setup socket.io
var io = require('socket.io').listen(app.listen(3001));

//util functions for app
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//User object
var User = function(id) {
	this.id = id;
	this.name = "User " + this.id;
	this.score = 0; //default score to 0
}

var Question = function() {
	this.number1 = getRandomInt(0,20);
	this.number2 = getRandomInt(0,20);
	this.answer = this.number1 + this.number2;
	this.display = this.number1 + " + " + this.number2 + " = ___ ";
}

var questions = [];
var members = {};
var q = {answer: 4}; //default to 4 since first question is 2 + 2;

io.sockets.on('connection', function (socket) {
	
	

	
	
	var newUser = new User(socket.id);
	members[socket.id] = newUser;

	//recieve answer from a connected socket
	socket.on('answer', function (data) {
		console.log("Received answer " +  data.answer + " from " + data.socket_id);	
		console.log("Solution: ",q.answer);
		if(parseInt(data.answer) === q.answer) {
			members[data.socket_id].score+=1;
			io.sockets.socket(data.socket_id).emit("correct-answer", members);
			socket.broadcast.emit('question-answered-correctly', members);
			q = new Question();
			socket.broadcast.emit('new-question', q);
			io.sockets.socket(data.socket_id).emit("new-question", q);	
		} else {
			//wrong answer, tell user
			io.sockets.socket(data.socket_id).emit("wrong-answer");
		}
	});

		
	socket.broadcast.emit("new-client", {members:members, q:q});
	io.sockets.socket(socket.id).emit("new-client", {members: members, q:q});
	
	socket.on('disconnect', function() {
		delete members[socket.id];
		socket.broadcast.emit("new-client", {members: members, q:q});		
	});
    
});



 



console.log('Listening on port 3001');
