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

//User object
var User = function(id) {
	this.id = id;
	this.name = "User " + this.id;
	this.score = 0; //default score to 0
}

var Question = function() {
	this.number1 = Math.random() * (20);
	this.number2 = Math.random() * (20);
	this.answer = this.number1 + this.number2;
	this.display = this.number1 + " + " + this.number2 + " = ___ ";
}

//Math Room Object
var Room = function(name) {
	var members = {};
	this.name = name;
	
	//add a member to the room
	function addMember(member) {
		member.score = 0;
		member[member.id] = member;
	}
}

//create Addition room
var additionRoom = new Room('Addition');

var questions = [];


var members = {};
var q = new Question();

io.sockets.q = q;
io.sockets.on('connection', function (socket) {
	
	

	
	
	var newUser = new User(socket.id);
	members[socket.id] = newUser;
	// _.each(io.sockets.clients(), function(client){
	//     	members[client.id] = client.id;
	// 	members[client.id].score = 0;
	// 	// if(!members[client.id].score){
	// 	// 			members[client.id].score = 0;
	// 	// 	    	
	// 	// 		}
	// 
	// });
	
	

	
	
	console.log("members: ", members);
	
	socket.broadcast.emit("new-client", members);
	io.sockets.socket(socket.id).emit("new-client", members);
	
	socket.on('disconnect', function() {
		delete members[socket.id];
		console.log("Members: ", members);
		socket.broadcast.emit("new-client", members);
		
	});
    
	
	var answer = "4";
	//recieve answer from a connected socket
	socket.on('answer', function (data) {
		console.log("Received answer " +  data.answer + " from " + data.socket_id);	
		
		if(data.answer === answer) {
			members[data.socket_id].score+=1;
			io.sockets.socket(data.socket_id).emit("correct-answer", members);
			socket.broadcast.emit('question-answered-correctly', members);
			q = new Question();
			socket.broadcast.emit('new-question', q);
			io.sockets.socket(data.socket_id).emit("new-question", q);
			
			
		}
	});	
});



 



console.log('Listening on port 3001');
