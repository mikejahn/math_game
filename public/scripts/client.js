var socket = io.connect('http://' + document.location.host);

//util functions for client.js
function emptyMessagesDiv() {
	setInterval(function() {
		$('#messages').html("");
	}, 2000);
}


$(function() {
	console.log('http://' + document.location.host);
	
	socket.on('new-client', function(clients){
		console.log("clients::: ",clients);
		
			$('#players').empty();

			_.each(clients.members, function(client){
			$('#players').append('<li>' + client.name+ '    - Score: ' + client.score + '</li>');

			});
			
			$('#content').html(clients.q.display);
			console.log("clients.q.display", clients.q.display);
		
	});
	

	
	socket.on('connect', function(){
		console.log("SOCKET!", socket);
    	socket.id = socket.socket.sessionid;
	
	
  	});
	
	$('#submit-button').click(function(){
		var answer = $("#answer").val();
		console.log("Submitting answer...");
    	socket.emit('answer', {answer: answer, socket_id: socket.id});
  	});

	socket.on("correct-answer", function(clients) {
		console.log("CORRECT!");
		$('#messages').html("Correct!");
		emptyMessagesDiv();
			$('#players').empty();

			_.each(clients, function(client){
			$('#players').append('<li>' + client.name+ '    - Score: ' + client.score + '</li>');

			});
	});
	
	socket.on("new-question", function(question) {
		$('#content').html(question.display);
	
	});
	
	socket.on('question-answered-correctly', function(clients) {
		console.log("someone else got it =(");
		$('#messages').html("Someone else got the answer first!");
		emptyMessagesDiv();
	
			$('#players').empty();

			_.each(clients, function(client){
			$('#players').append('<li>' + client.name+ '    - Score: ' + client.score + '</li>');

			});
		
	})

	
});