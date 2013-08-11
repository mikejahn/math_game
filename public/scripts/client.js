var socket = io.connect('http://' + document.location.host);

//util functions for client.js
//empty the messages div
function emptyMessagesDiv() {
	setInterval(function() {
		$('#messages').html("");
		$('#messages').removeClass();
	}, 4000);
}

//repaint the leaderboard
function paintLeaderBoard(members) {
	$('#players').empty();
	_.each(members, function(client){
		if(client.id === socket.id){
			$('#players').append('<li><b>' + client.name + '    - Score: ' + client.score + '</b> <--- thats you!</li>');	
		} else {
			$('#players').append('<li>' + client.name + '    - Score: ' + client.score + '</li>');	
		}
	});
}


$(function() {
	
	socket.on('new-client', function(data){
		paintLeaderBoard(data.members);
		$('#content').html(data.q.display);
	});
	
	socket.on('connect', function(){
    	socket.id = socket.socket.sessionid;
  	});

	$('#answer').keydown(function (e){
	    if(e.keyCode == 13){
	        	var answer = $("#answer").val();
		    	socket.emit('answer', {answer: answer, socket_id: socket.id});
				$("#answer").val("");
	    }
	})
	
	$('#submit-button').click(function(){
		var answer = $("#answer").val();
    	socket.emit('answer', {answer: answer, socket_id: socket.id});
		$("#answer").val("");
  	});

	socket.on("correct-answer", function(members) {
		$("#messages").addClass("alert alert-success");
		$('#messages').html("Correct!");
		emptyMessagesDiv();
		paintLeaderBoard(members);	
	});
	
	socket.on("wrong-answer", function(question) {
		$("#messages").addClass("alert alert-error");
		$('#messages').html("Wrong!");
		emptyMessagesDiv();
	});
	
	socket.on("new-question", function(question) {
		$('#content').html(question.display);
	});
	
	socket.on('question-answered-correctly', function(members) {
		$("#messages").addClass("alert alert-error");
		$('#messages').html("Someone else got the answer first!");
		emptyMessagesDiv();
		paintLeaderBoard(members);	
	});

	
});