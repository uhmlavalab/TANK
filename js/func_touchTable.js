



function setupKonva(callback) {

	var stage = new Konva.Stage({
		container: "game_field",
		width: global.field.width,
		height: global.field.height,
	});

	global.konva.stage = stage;
	global.konva.layerBackground =  new Konva.Layer();
	global.konva.layerMiddleGround =  new Konva.Layer();
	global.konva.layerForeground =  new Konva.Layer();
	global.konva.layerUi =  new Konva.Layer();
	
	stage.add(global.konva.layerBackground);
	stage.add(global.konva.layerMiddleGround);
	stage.add(global.konva.layerForeground);
	stage.add(global.konva.layerUi);

	// background image, randomly selected
	global.konva.backgroundImageHtmlElement = new Image();
	global.konva.backgroundImageHtmlElement.src = global.img.filePath + "backgrounds/gridv2.png";
	// console.log(global.konva.backgroundImageHtmlElement);
	global.konva.backgroundImage = new Konva.Image({
		x: 0,
		y: 0,
		image: global.konva.backgroundImageHtmlElement,
		width: global.field.width,
		height: global.field.height
	});
	global.konva.layerBackground.add(global.konva.backgroundImage);
	loadImages(callback);
}

function loadImages(callback) {

	let called = false;
	let imgLoadComplete = function() {
		global.img.loadCount++;
		if (called) {
			return;
		}
		if (global.img.loadCount >= global.img.loadTotal) {
			callback();
			called = true;
		}
	};
	for (let i = 0; i < global.img.tank.colors.length; i++) {
		// Tank, just append png
		global.img.references[global.img.filePath + global.img.tank.colors[i] + ".png"] = new Image();
		global.img.references[global.img.filePath + global.img.tank.colors[i] + ".png"].src = global.img.filePath + global.img.tank.colors[i] + ".png";
		global.img.references[global.img.filePath + global.img.tank.colors[i] + ".png"].onload = imgLoadComplete;
		// Cannon, append c.png
		global.img.references[global.img.filePath + global.img.tank.colors[i] + "c.png"] = new Image();
		global.img.references[global.img.filePath + global.img.tank.colors[i] + "c.png"].src = global.img.filePath + global.img.tank.colors[i] + "c.png";
		global.img.references[global.img.filePath + global.img.tank.colors[i] + "c.png"].onload = imgLoadComplete;
		// Bullet, b.png
		global.img.references[global.img.filePath + global.img.tank.colors[i] + "b.png"] = new Image();
		global.img.references[global.img.filePath + global.img.tank.colors[i] + "b.png"].src = global.img.filePath + global.img.tank.colors[i] + "b.png";
		global.img.references[global.img.filePath + global.img.tank.colors[i] + "b.png"].onload = imgLoadComplete;

		// +3 for tank, cannon, bullet
		global.img.loadTotal += 3;
	}
	// Now load control images
	global.img.references[global.img.filePath + "controls/fire.png"] = new Image();
	global.img.references[global.img.filePath + "controls/fire.png"].src = global.img.filePath + "controls/fire.png";
	global.img.references[global.img.filePath + "controls/fire.png"].onload = imgLoadComplete;
	global.img.loadTotal += 1;
	global.img.references[global.img.filePath + "controls/tank.png"] = new Image();
	global.img.references[global.img.filePath + "controls/tank.png"].src = global.img.filePath + "controls/tank.png";
	global.img.references[global.img.filePath + "controls/tank.png"].onload = imgLoadComplete;
	global.img.loadTotal += 1;
	global.img.references[global.img.filePath + "controls/turret.png"] = new Image();
	global.img.references[global.img.filePath + "controls/turret.png"].src = global.img.filePath + "controls/turret.png";
	global.img.references[global.img.filePath + "controls/turret.png"].onload = imgLoadComplete;
	global.img.loadTotal += 1;
}


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

function disableContextMenu() {
	document.addEventListener("contextmenu", (e) => {
		e.preventDefault();
	});
}

function setupBgSound() {
	// Create bg that loops
	let a = document.createElement("audio");
	let s = document.createElement("source");

	// Setup values
	a.loop = true;
	a.autoplay = true;
	s.src = global.sound.filePath + "the_game_has_changed.mp3";
	s.type = "audio/mp3";
	a.appendChild(s);
	a.volume = 0.5;
	// It doens't need to be attached to work
	global.sound.background = a;
}



// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// Probably final


function createTanksForTouchTable() {
	createTank("red");
	createTank("blue");
	createTank("green");
	createTank("pink");

	let controlHeight = 200;
	createControlSet(0, 500, controlHeight, 90, global.allTanks[0]);
	createControlSet(0, 500, controlHeight, 90, global.allTanks[1]);
	createControlSet(500, 500, controlHeight, -90, global.allTanks[2]);
	createControlSet(500, 500, controlHeight, -90, global.allTanks[3]);

	moveControlsToEdgeOfScreen(controlHeight);
}

// p1 and p2 are going to be on the left, 3,4 on the right
function moveControlsToEdgeOfScreen(controlHeight) {
	let margin = 20;
	p1c = global.allControls[0].container;
	p2c = global.allControls[1].container;
	p3c = global.allControls[2].container;
	p4c = global.allControls[3].container;
	// rotation is based around the center

	// their left should be half the height
	p1c.style.left = controlHeight / -2 + margin + "px";
	p2c.style.left = controlHeight / -2 + margin + "px";
	p3c.style.left = window.innerWidth - (controlHeight / -2 + margin + controlHeight * 2) + "px";
	p4c.style.left = window.innerWidth - (controlHeight / -2 + margin + controlHeight * 2) + "px";
	// their top value should be half the width + where it should be located
	p1c.style.top = controlHeight / 2 + margin + "px";
	p2c.style.top = window.innerHeight - (controlHeight / 2 + margin + controlHeight) + "px";
	p3c.style.top = controlHeight / 2 + margin + "px";
	p4c.style.top = window.innerHeight - (controlHeight / 2 + margin + controlHeight) + "px";
}


// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// testing


function createTank(color) {
	return new Tank(color);
}
