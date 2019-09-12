
var firebase_connection = {
	debug: true,
	config:  {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  },

	// referneces to firebase pieces
	app: null,
	storage: null,
	database: null,
	callbackAfterGettingUid: null,

	onAuthStateChanged: null,

	debugprint: function(line) {
		if (!firebase_connection.debug) return;
		if (arguments.length > 1) {
			let otherArgs = Array.from(arguments).slice(1); // Arugments is an array-like object, not an array
			console.log("Debug> firebase_connection> " + line, otherArgs);
		} else {
			console.log("Debug> firebase_connection> " + line);
		}
	},

	// ------------------------------------------------------------------------------------------------------------------------------------------------------
	// Initialization functions
	init: function(callbackAfterGettingUid) {
		this.fb_setup_connections();
		this.fb_setup_authStateHandler();
		this.callbackAfterGettingUid = callbackAfterGettingUid;
	},

	fb_setup_connections: function() {
		// Initialize Firebase
		this.app = firebase.initializeApp(this.config);
		
		// // You can retrieve services via the defaultApp variable...
		// var defaultStorage = defaultApp.storage();
		// var defaultDatabase = defaultApp.database();
		// // ... or you can use the equivalent shorthand notation
		// defaultStorage = firebase.storage();
		// defaultDatabase = firebase.database();
		
		// this.storage = this.app.storage(); // This wasn't included in the script 
		this.database = this.app.database();

	},

	fb_setup_authStateHandler: function() {
		this.app.auth().onAuthStateChanged((user) => {
			this.debugprint("this onAuthStateChanged");
			if (user) {
				// User is signed in.
				this.debugprint("  User login" + ((user.isAnonymous) ? "(isAnonymous)" : "") + ", uid: " + user.uid + " also status:", user);
				if (this.callbackAfterGettingUid) {
					this.callbackAfterGettingUid(user.uid);
				}
			} else {
				this.debugprint("  Status was signed out", user);
				this.signInAnonymousely();
			}
			// Activate the function handler if given to the connection object
			if (this.onAuthStateChanged) {
				this.onAuthStateChanged(user);
			}
		});
	},

	// ------------------------------------------------------------------------------------------------------------------------------------------------------
	// Public functions
	signInAnonymousely: function() {
		this.debugprint("Attempting to sign in anonymously");
		// Auth state handler will react to successful sign in
		firebase.auth().signInAnonymously().catch(function(error) {
			if (error.code === "auth/operation-not-allowed") {
				alert("Anonymous authentication was not allowed. It must be enabled in the Firebase Console.");
			} else if (error) {
				alert("Error when trying to sign in anonymousely, " + error.code + " : " + error.message + ". See console for more details.");
				console.log("Error when trying to sign in anonymousely", error);
			}
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

	
}; // end firebase_connection
