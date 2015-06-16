var socket = io('/');

function initialize (username) {

	var user   = username;

	var $discussionForm = $('#discussion-form');
	var $inputMessage = $('#message');
	var $discussionMessages = $('div.discussion-messages');

	$discussionForm.submit( function(e){
		e.preventDefault();
		socket.emit('message', {
			msg: $inputMessage.val(),
			user: user
		});
	});

	socket.on('message', function (data) {
		$discussionMessages.prepend('<p>'+data.user+' : '+data.msg+'</p>');
		$inputMessage.val('');
	});
	
};