





function createControlSet(containerLeft, containerTop, height, rotation = 0, tank) {
	let width;
	if (height.width) { // if extra data was stacked for mobile
		width = height.width;
		height = height.height;
	} else {
		width = height * 2; // space for two equal circles
	}
	width = height * 2;
	let pieces = {};
	let c = pieces.container = document.createElement("div");
	let mc = pieces.moveCircle = document.createElement("img");
	mc.src = global.img.filePath + "controls/tank.png";
	let ac = pieces.aimCircle = document.createElement("img"); // shares with fire rectangle. thirds? fourths?
	ac.src = global.img.filePath + "controls/turret.png";
	let fr = pieces.fireRectangle = document.createElement("img");
	fr.src = global.img.filePath + "controls/fire.png";
	// color line only shows up on the touch table for now
	let isUsingColorLine = false;
	let tableColors = ["red", "blue", "green", "pink"];
	let cl = pieces.colorLine = document.createElement("img");
	if (tableColors.includes(tank.color)) {
		isUsingColorLine = true;
		cl.src = global.img.filePath + "controls/" + tank.color + ".png";
		cl.style.background = "black";
		cl.style.border = "1px solid black";
		cl.style.width = width + "px";
		cl.style.height = height * 0.1 + "px";
		cl.style.position = "absolute";
		cl.style.top = -1 * height * 0.1 + "px";
		cl.style.left = "-1px";
		c.appendChild(cl);
	}

	// style them, roughly 1/2 per
	let all = [c, mc, ac, fr];
	for (let i = 0; i < all.length; i++) {
		all[i].draggable = false;
		all[i].style.border = "1px solid black";
		all[i].style.position = "absolute";
		all[i].addEventListener("scroll", (e) => {
			e.preventDefault();
		});
	}
	all = [mc, ac];
	for (let i = 0; i < all.length; i++) {
		all[i].style.borderRadius = "50%";
		all[i].style.textAlign = "center";
		all[i].style.verticalAlign = "middle";
	}
	fr.style.textAlign = "center";
	fr.style.verticalAlign = "middle";

	// Container is whole value, move and aim circle are 1/2, fire is 1/4
	// size
	c.style.width = width + "px";
	c.style.height = height + "px";
	c.style.transform = "rotate(" + rotation + "deg)";
	mc.width = height;
	mc.height = height;
	mc.style.width = mc.height + "px";
	mc.style.height = mc.height + "px";
	ac.width = height / 3 * 2;
	ac.height = height / 3 * 2;
	ac.style.width = ac.width + "px";
	ac.style.height = ac.height + "px";
	fr.width = height / 3 * 2;
	fr.height = height / 3 - 10;
	fr.style.width = fr.width + "px";
	fr.style.height = fr.height + "px";

	
	// position
	c.style.left = containerLeft + "px";
	c.style.top = containerTop + "px";
	mc.style.top = "0px";
	mc.style.left = "0px";
	ac.style.top = height / 3 + "px";
	ac.style.left = (width / 4 * 3) - (ac.width / 2)  + "px";
	fr.style.top = 5 + "px";
	fr.style.left = (width / 4 * 3) - (fr.width / 2) + "px";

	// color
	c.style.background = "black"; // currently always set it.
	// mc.style.background = "#67C63A"; // Disable color
	// ac.style.background = "#FA9E25";
	// fr.style.background = "#F91A25";

	// Text
	mc.textContent = "Move";
	ac.textContent = "Position Barrel";
	fr.textContent = "Fire";
	
	// Add listeners
	let needsToRespawn = function() {
		if (!tank.active) {
			mc.textContent = "Press Fire to Start";
			return true;
		}
		return false;
	};
	let moveHandler = function(e) {
		let dx = e.offsetX - this.width / 2;
		let dy = e.offsetY - this.height / 2;
		let angle = global.degreeFromXy(dx, dy);
		let buttons = e.buttons;
		if (isMobileClient) {
			mobile_handler_move(angle);
		} else {
			if (needsToRespawn()) return;
			if (e.buttons == 1) {
				tank.setMove(angle + rotation);
				// if (!this.currentImageRotation) {
				// 	this.style.transform = "rotate(" + (angle + rotation) + "deg)";
				// 	this.currentImageRotation = (angle + rotation);
				// } else {
				// 	this.currentImageRotation = (angle - this.currentImageRotation);
				// 	this.style.transform = "rotate(" + (this.currentImageRotation) + "deg)";
				// }
			}
		}
	};
	let moveStopHandler = function() {
		if (isMobileClient) {
			mobile_handler_stopMoving();
		} else {
			if (needsToRespawn()) return;
			tank.stopMoving();
		}
	};
	let aimHandler = function(e) {
		let dx = e.offsetX - this.width / 2;
		let dy = e.offsetY - this.height / 2;
		let angle = global.degreeFromXy(dx, dy);
		if (isMobileClient) {
			mobile_handler_setBarrelAngle(angle);
		} else {
			if (needsToRespawn()) return;
			tank.setBarrelAngle(angle + rotation);
		}
	};
	let fireHandler = function(e) {
		if (isMobileClient) {
			mobile_handler_fire();
		} else {
			if (!tank.active) {
				tank.randomSpawn();
			} else {
				tank.fire();
			}
		}
	};
	
	mc.addEventListener("pointerdown", moveHandler);
	mc.addEventListener("pointermove", moveHandler);
	mc.addEventListener("pointerup", moveStopHandler);
	ac.addEventListener("pointerdown", aimHandler);
	ac.addEventListener("pointermove", aimHandler);
	fr.addEventListener("pointerdown", fireHandler);

	// ios workaround
	let iosmh = function (e) {
		if (!isMobileClient) return;
		for (var i = 0; i < e.changedTouches.length; i++) {
			if (e.changedTouches[i].target == this) {
				let offsetX = e.changedTouches[i].clientX - parseInt(this.style.left);
				let offsetY = e.changedTouches[i].clientY - parseInt(this.style.top);
				 moveHandler.bind(this)({offsetX, offsetY, buttons: 1}); break; } }
		e.preventDefault();
	};
	let iossh = function (e) {
		if (!isMobileClient) return;
		for (var i = 0; i < e.changedTouches.length; i++) {
			if (e.changedTouches[i].target == this) {
				let offsetX = e.changedTouches[i].clientX - parseInt(this.style.left);
				let offsetY = e.changedTouches[i].clientY - parseInt(this.style.top);
				 moveStopHandler.bind(this)({offsetX, offsetY, buttons: 1}); break; } }
		e.preventDefault();
	};
	let iosah = function (e) {
		if (!isMobileClient) return;
		for (var i = 0; i < e.changedTouches.length; i++) {
			if (e.changedTouches[i].target == this) {
				let offsetX = e.changedTouches[i].clientX - parseInt(this.style.left);
				let offsetY = e.changedTouches[i].clientY - parseInt(this.style.top);
				 aimHandler.bind(this)({offsetX, offsetY, buttons: 1}); break; } }
		e.preventDefault();
	};
	let iosfh = function (e) {
		if (!isMobileClient) return;
		for (var i = 0; i < e.changedTouches.length; i++) {
			if (e.changedTouches[i].target == this) {
				 fireHandler(e.changedTouches[i]); break; } }
		e.preventDefault();
	};
	let iosc = function(e) {
		e.preventDefault();
	}
	mc.addEventListener("touchstart", iosmh);
	mc.addEventListener("touchmove", iosmh);
	mc.addEventListener("touchend", iossh);
	ac.addEventListener("touchstart", iosah);
	ac.addEventListener("touchmove", iosah);
	fr.addEventListener("touchstart", iosfh);
	c.addEventListener("touchstart", iosc);
	c.addEventListener("touchmove", iosc);
	c.addEventListener("touchend", iosc);


	// Color picker no longer allowed, images have preset colors
	// // Last minute color picker adder
	// let cp = pieces.colorPicker = document.createElement("input");
	// cp.type = "color";
	// cp.value = tank.color;
	// cp.addEventListener("change", function () {
	// 	if (isMobileClient) {
	// 		networkValues.packetToSend = {uid: networkValues.uid, color: cp.value};
	// 	} else {
	// 		tank.changeColor(cp.value);
	// 	}
	// 	c.style.background = cp.value;
	// });
	// cp.style.position = "absolute";
	// cp.style.top = "0px";
	// cp.style.left = width / 2 - 10 + "px";



	// attach them
	pieces.container.appendChild(pieces.moveCircle);
	pieces.container.appendChild(pieces.aimCircle);
	pieces.container.appendChild(pieces.fireRectangle);
	// pieces.container.appendChild(pieces.colorPicker);
	document.body.appendChild(pieces.container);

	global.allControls.push(pieces);
	return pieces;
}






