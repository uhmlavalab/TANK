

function main_touchTable() {
	// Setup Konva, callback to do the rest
	setupKonva((()=> {
		// Reason: Must load images before refencing them for cache purposes
		global.resizeTheCanvi();
		startMainLoop();
		setupPointerListeners();
		disableContextMenu();
		createTanksForTouchTable();
		setupBgSound();
		
	
		network_init();
	
		// Testing purposes
		// setTimeout(() => {
		// }, 1000);
	}));
}

function startMainLoop() {
	global.time.lastUpdate = Date.now();

	setInterval(mainLoop, 1000 / global.time.fps);
}


function mainLoop() {
	global.time.dt = (Date.now() - global.time.lastUpdate) / 1000;
	global.time.lastUpdate = Date.now();

	for (let i = 0; i < global.allEntities.length; i++) {
		global.allEntities[i].update();
	}
	global.konva.stage.draw();
}







var networkValues = {
	paths: {
		t_users: "/t_users",
		t_updates: "/t_updates/",
	},
	userList: [],
	userTanks: {}, // use uid to get the tank
};

function network_init() {
	// clear out the users
	firebase_connection.setPathOnce(networkValues.paths.t_users, []);
	// clear out the updates
	firebase_connection.setPathOnce(networkValues.paths.t_updates, null);
	
	// subscribe to value changes
	console.log("getPathValueUpdates uid:" + firebase_connection.app.auth().currentUser.uid, firebase_connection.app.auth().currentUser);
	firebase.database().ref(networkValues.paths.t_users).on('value', network_handleUserListChange);
}


function network_handleUserListChange(snapshot) {
	let value = snapshot.val();
	let userListString = networkValues.userList.join(" ");
	let tank;
	if (value && value.length) {
		for (let i = 0; i < value.length; i++) {
			if (!userListString.includes(value[i])) {
	
				tank = createTank();
				networkValues.userList.push(value[i]);
				console.log("trying to get new tank value changes. getPathValueUpdates uid:" + firebase_connection.app.auth().currentUser.uid, firebase_connection.app.auth().currentUser);
				firebase.database().ref(networkValues.paths.t_updates + value[i]).on('value', updateRemoteUserTank);
				networkValues.userTanks[value[i]] = tank;
			}
		}
	}
}

function updateRemoteUserTank(snapshot) {
	let value = snapshot.val();

	if (!value || !value.uid) {
		console.log("ERROR: no uid for remote user", value);
		return;
	}

	if (value.move) {
		networkValues.userTanks[value.uid].setMove(value.move);
	} else if (value.color) {
		networkValues.userTanks[value.uid].changeColor(value.color);
	} else if (value.stopMoving) {
		networkValues.userTanks[value.uid].stopMoving();
	} else if (value.setBarrelAngle) {
		networkValues.userTanks[value.uid].setBarrelAngle(value.setBarrelAngle);
	} else if (value.fire) {
		if (!networkValues.userTanks[value.uid].active) {
			networkValues.userTanks[value.uid].randomSpawn();
		} else {
			networkValues.userTanks[value.uid].fire();
		}
	}
}


