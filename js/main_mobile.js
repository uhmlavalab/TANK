
var networkValues = {
	uid: null,
	updateSpeed: 100, // interval
	connected: false,
	hasAddedSelf: false,
	paths: {
		t_users: "/t_users",
		t_updates: "/t_updates/",
	},
	packetToSend: null,
	color: global.img.tank.colors[global.getRandomInt(4,7)],
};


function main_mobile(uid) {
	setupPointerListeners();
	network_addSelfToUserList(uid);
	let height = window.innerHeight;
	let width = window.innerWidth;
	if (height * 2 > width) {
		height = width / 2;
	}

	createControlSet(0, 0, {height, width}, 0, { color: networkValues.color });
}


// this mainly allows disable of the pinch zoom and pulldown refresh
function setupPointerListeners() {
	let container = document.getElementById("game_field");
	container.onpointerdown = noTouchZoom;
	container.onpointermove = noTouchZoom;
	container.onpointerup = noTouchZoom;
	container.onpointercancel = noTouchZoom;
	container.onpointerout = noTouchZoom;
	container.onpointerleave = noTouchZoom;

	container.ontouchstart = noTouchZoom;
	container.ontouchend = noTouchZoom;
	container.ontouchcancel = noTouchZoom;
	container.ontouchmove = noTouchZoom;

	function noTouchZoom(e) {
		// console.log(e);
	}
}



function network_addSelfToUserList(uid){
	networkValues.connected = true;
	networkValues.uid = uid;
	// add self to list
	firebase.database().ref(networkValues.paths.t_users).once('value').then((snapshot) => {
		let value = snapshot.val();
		networkValues.hasAddedSelf = true;
		if (value == null) {
			value = [uid]
		} else {
			value.push(uid);
		}
		firebase_connection.setPathOnce(networkValues.paths.t_users, value);
		alert("Connected!");
		setTimeout(() => {
			firebase_connection.setPathOnce(networkValues.paths.t_updates + networkValues.uid, {uid: networkValues.uid, color: networkValues.color});
		}, 3000); // some time after connection, auto send the color packet
	});

	setInterval(checkForPacketToSend, networkValues.updateSpeed); // delayed between
}

function checkForPacketToSend() {
	if (networkValues.packetToSend) {
		firebase_connection.setPathOnce(networkValues.paths.t_updates + networkValues.uid, networkValues.packetToSend);
		networkValues.packetToSend = null;
	}
}



function mobile_handler_move(angle) {
	if (networkValues.hasAddedSelf) {
		networkValues.packetToSend = {uid: networkValues.uid, move: angle};
	}
}

function mobile_handler_stopMoving() {
	if (networkValues.hasAddedSelf) {
		networkValues.packetToSend = {uid: networkValues.uid, stopMoving: true};
	}
}
function mobile_handler_setBarrelAngle(angle) {
	if (networkValues.hasAddedSelf) {
		networkValues.packetToSend = {uid: networkValues.uid, setBarrelAngle: angle};
	}
}
function mobile_handler_fire() {
	if (networkValues.hasAddedSelf) {
		networkValues.packetToSend = {uid: networkValues.uid, fire: true};
	}
}


