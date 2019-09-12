

// global
var global = {};


global.field = {};
global.field.width = 3840;
global.field.height = 2160;


global.konva = {};
global.konva.stage = null;
global.konva.layerBackground = null;
global.konva.layerMiddleGround = null;
global.konva.layerForeground = null;
global.konva.layerUi = null;


global.time = {};
global.time.fps = 24;
global.time.lastUpdate = null;
global.time.dt = null;


global.allEntities = [];
global.allBullets = [];
global.allTanks = [];
global.allEffects = [];
global.allControls = [];

global.img = {};
global.img.filePath = "img/";
global.img.tank = {};
global.img.tank.colors = [
	"blue", "green", "pink", "red", "white", "yellow", "cyan", 
];
global.img.backgrounds = [
	"grid-01.png", "grid2-01.png", //  "grid2-grey.png",
	// "hex.jpg", "grid-01.png", "grid2-01.png", "grid2-grey.png"
];
global.img.references = {};
global.img.loadCount = 0;
global.img.loadTotal = 0; // incremented after performing load

global.sound = {};
global.sound.filePath = "sounds.ignore/"

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

global.resizeTheCanvi = function() {
	let div = global.konva.stage.getContent();
	div.style.width = window.innerWidth * 0.99 + "px";
	div.style.height = window.innerHeight * 0.99 + "px";
	let canvi = div.getElementsByTagName("canvas");
	for (let i = 0; i < canvi.length; i++) {
		canvi[i].style.width = "100%";
		canvi[i].style.height = "100%";
		canvi[i].width = global.field.width;
		canvi[i].height = global.field.height;
	}
};

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * 
 * @param {*} min inclusive
 * @param {*} max exclusive
 */
global.getRandomInt = function (min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

global.toDegrees = function (angle) {
  return angle * (180 / Math.PI);
};

global.toRadians = function (angle) {
  return angle * (Math.PI / 180);
};

global.yFromDegree = function(degree, hypotenuse) {
	return Math.sin(global.toRadians(degree)) * hypotenuse;
};

global.xFromDegree = function(degree, hypotenuse) {
	return Math.cos(global.toRadians(degree)) * hypotenuse;
};

global.degreeFromXy = function(x, y) {
	return global.toDegrees(Math.atan2(y, x));
};


global.distanceBetween = function(x1, y1, x2, y2) {
	let dx = x2 - x1;
	let dy = y2 - y1;
	
	return Math.sqrt(dx * dx + dy * dy);
};


