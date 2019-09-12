


// Designed for after connection

var test_data_basic = {
	debug: true,

	debugprint: function(line) {
		if (!test_data_basic.debug) return;
		if (arguments.length > 1) {
			let otherArgs = Array.from(arguments).slice(1); // Arugments is an array-like object, not an array
			console.log("Debug> test_data_basic> " + line, otherArgs);
		} else {
			console.log("Debug> test_data_basic> " + line);
		}
	},

	getListOfUsersOnce: function() {
		this.debugprint("getListOfUsersOnce uid:" + firebase_connection.app.auth().currentUser.uid, firebase_connection.app.auth().currentUser);
		firebase.database().ref('/users').once('value').then((snapshot) => {
			this.debugprint("The snapshot val():", snapshot.val());
		});
	},

	getPathOnce: function(path) {
		this.debugprint("getPathOnce uid:" + firebase_connection.app.auth().currentUser.uid, firebase_connection.app.auth().currentUser);
		firebase.database().ref(path).once('value').then((snapshot) => {
			this.debugprint("The snapshot val() of " + path + ":", snapshot.val());
		});
	},

	getPathValueUpdates: function(path) {
		this.debugprint("getPathValueUpdates uid:" + firebase_connection.app.auth().currentUser.uid, firebase_connection.app.auth().currentUser);
		firebase.database().ref(path).on('value', (snapshot) => {
			this.debugprint("The snapshot val() of " + path + ":", snapshot.val());
		});
	},

	// Full overwrite
	setPathOnce: function(path, value) {
		this.debugprint("setPathOnce uid:" + firebase_connection.app.auth().currentUser.uid, firebase_connection.app.auth().currentUser);
		firebase.database().ref(path).set(value)
			.then(() => {
				this.debugprint("setPathOnce should have completed write operation");
			});
	},

	updatePathOnce: function(path, value) {
		this.debugprint("updatePathOnce uid:" + firebase_connection.app.auth().currentUser.uid, firebase_connection.app.auth().currentUser);
		firebase.database().ref(path).update(value)
			.then(() => {
				this.debugprint("updatePathOnce should have completed write operation");
			});
	},

};







