var name = getQueryVariable('name');
var room = getQueryVariable('room');

// TODO create Authenticate for users

var groupName = '';
var userEmail = '';



var socket = io();

console.log(name + ' wants to join ' + room);

var $roomTitle = jQuery("#room-title");
$roomTitle.append(room);

socket.on('connect', function(){
	console.log('connected to socket io server');
	socket.emit('joinRoom', {name: name, room: room});
});


// When message received on client side

socket.on('message', function(message){
	var momentTimestamp = moment.utc(message.timestamp);
	var $messages = jQuery('.messages');
	var $message = jQuery('<li class="list-group-item"></li>');

	console.log('New message:\n' + message.text);

	$message.append('<p><strong>' + message.name + ' ' 
		+ momentTimestamp.local().format('h:mm a') + '</strong></p>'
		+ '<p>' + message.text + '</p>');

	$messages.append($message);
});

// On Message Submit

var $messageForm = jQuery('#message-form');

$messageForm.on('submit', function (event) {
	event.preventDefault();

	var $message = $messageForm.find('input[name=message]');

	socket.emit('message', {
		name: name,
		text: $message.val()
	});

	$message.val('');
});

// On Group Create



var $groupCreationForm = jQuery("#group-form");

$groupCreationForm.on('submit', function (event) {
	event.preventDefault();

	var $groupName = $groupCreationForm.find('input[name=groupName]');

	socket.emit('createGroup', {
		name: $groupName.val(),
		userEmail: userEmail
	});


});




