var name = getQueryVariable('name');
var room = getQueryVariable('room');


var socket = io();

console.log(name + ' wants to join ' + room);

var $roomTitle = jQuery("#room-title");
$roomTitle.append(room);

socket.on('connect', function(){
	console.log('connected to socket io server');
	socket.emit('joinRoom', {name: name, room: room});
});

socket.on('message', function(message){
	console.log("New Message \n" + message.text);
	var momentTimestamp = moment.utc(message.timestamp);
	var $message = jQuery('.messages');
	$message.append("<p><strong>" + message.name + ' '
		+ momentTimestamp.local().format("h:mm a") + ": </strong>");
	$message.append(message.text + "</p>");
});

var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');

	socket.emit('message', {
		name: name,
		text: $message.val()
	});

	$message.val('');
});