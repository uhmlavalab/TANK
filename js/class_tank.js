

class Tank {
	constructor(color) {
		this.initValues(color);
		this.createVisuals(color);
		this.createSounds();
		this.createEffects();

		global.allTanks.push(this);
		global.allEntities.push(this);
	}

	// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

	initValues(color) {
		this.isTank = true;
		this.xCenter = 0;
		this.yCenter = 0;
		this.width = 160; // image is ratio 4:3
		this.height = 120;
		if (color) {
			this.color = color;
		} else {
			this.color = "red";
		}

		this.active = false;
		this.bodyAngle = 0;
		this.barrelAngle = 0;
		this.speed = 100;
		this.moving = false;

		this.bullets = [];
		this.bulletLimit = 3;
		for (let i = 0; i < this.bulletLimit; i++) {
			this.bullets.push(new Bullet(this));
		}
		this.fireDelay = 500; // ms
		this.lastFireTime = Date.now();
		this.score = 0;

	}

	createVisuals() {
		this.visuals = {};
		this.visuals.group = new Konva.Group({
			x: 0,
			y: 0
		});
		this.visuals.barrelGroup = new Konva.Group({
			x: 0,
			y: 0
		});
		this.visuals.firePointGroup = new Konva.Group({
			x: 0,
			y: 0
		});
		this.visuals.body = new Konva.Rect({
      x: -1 * this.width / 2,
      y: -1 * this.height / 2,
			width: this.width,
			height: this.height,
      fill: this.color,
      stroke: 'black',
      strokeWidth: 4
		});
		this.visuals.barrel = new Konva.Rect({
      x: 0,
      y: -1 * this.height / 2 / 4,
			width: this.width * 0.7,
			height: this.height / 4,
      fill: this.color,
      stroke: 'black',
      strokeWidth: 4
		});
		this.visuals.scoreText = new Konva.Text({
      x: this.visuals.body.x(),
      y: this.height / 2 + 10,
      text: 'Rank',
      fontSize: 30,
      fontFamily: 'Arial',
      fill: 'black'
    });
		this.visuals.scoreTextOutline1 = this.visuals.scoreText.clone({
			x: this.visuals.scoreText.x() - 4,
			y: this.visuals.scoreText.y() - 4,
      fill: 'white'
		});
		this.visuals.scoreTextOutline2 = this.visuals.scoreText.clone({
			x: this.visuals.scoreText.x() + 4,
			y: this.visuals.scoreText.y() + 4,
      fill: 'white'
		});

		// New body using images
		let imageMultiplierWidth = 1;
		let imageMultiplierHeight = 1;
		this.visuals.bodyImage = new Konva.Image({
      x: -1 * (this.width * imageMultiplierWidth) / 2,
      y: -1 * (this.height * imageMultiplierHeight) / 2,
			image: global.img.references[global.img.filePath + this.color + ".png"],
			width: this.width * imageMultiplierWidth,
			height: this.height * imageMultiplierHeight
		});
		this.visuals.cannonImageHtmlElement = new Image();
		this.visuals.cannonImageHtmlElement.src = global.img.filePath + this.color + "c.png"; // c for cannon
		this.visuals.cannonImage = new Konva.Image({
      x: -1 * (this.width * imageMultiplierHeight) * .36, // keeping the same multiplier as width (smaller value)
      y: -1 * (this.height * imageMultiplierHeight) * .56,
			image: global.img.references[global.img.filePath + this.color + "c.png"],
			width: this.width * imageMultiplierHeight,
			height: this.height * imageMultiplierHeight
		});
		this.visuals.firePointReference = new Konva.Rect({
      x: -1,
      y: -1,
			width: 2,
			height: 2,
      fill: this.color,
      stroke: 'black',
      strokeWidth: 4
		});

		// this.visuals.group.add(this.visuals.body);
		// this.visuals.group.add(this.visuals.barrel);
		this.visuals.group.add(this.visuals.scoreTextOutline1);
		this.visuals.group.add(this.visuals.scoreTextOutline2);
		this.visuals.group.add(this.visuals.scoreText);
		this.visuals.group.add(this.visuals.bodyImage);
		// this.visuals.firePointGroup.add(this.visuals.firePointReference); // for checking the fire source
		this.visuals.firePointGroup.x(this.width * imageMultiplierHeight * .64);
		this.visuals.firePointGroup.y(this.height * imageMultiplierHeight * -0.25);
		this.visuals.barrelGroup.add(this.visuals.firePointGroup);
		this.visuals.barrelGroup.add(this.visuals.cannonImage);
		this.visuals.barrelGroup.x(-1 * this.width * .15);
		this.visuals.barrelGroup.y(this.height * .15);
		this.visuals.group.add(this.visuals.barrelGroup);
		this.visuals.group.x(-100);
		this.visuals.group.y(-100);
		global.konva.layerMiddleGround.add(this.visuals.group);
	}

	createSounds() {
		this.sounds = {};
		// Fire
		this.sounds.shot = {};
		this.sounds.shot.audio = document.createElement("audio");
		this.sounds.shot.source = document.createElement("source");
		this.sounds.shot.source.src = global.sound.filePath + "tankfire.mp3";
		this.sounds.shot.source.type = "audio/mp3";
		this.sounds.shot.audio.appendChild(this.sounds.shot.source);
		// Death
		this.sounds.derezz = {};
		this.sounds.derezz.audio = document.createElement("audio");
		this.sounds.derezz.source = document.createElement("source");
		this.sounds.derezz.source.src = global.sound.filePath + "Derezz.mp3";
		this.sounds.derezz.source.type = "audio/mp3";
		this.sounds.derezz.audio.appendChild(this.sounds.derezz.source);
	}

	createEffects() {
		// Effect from shot
		this.effectDerezz = new Effect_Derezz(this.color);
		// Originally fully contained here, decided to make separate class for it
	}

	changeColor(color) {
		this.color = color;
		this.visuals.body.fill(color);
		this.visuals.barrel.fill(color);
		this.visuals.bodyImage.image(global.img.references[global.img.filePath + this.color + ".png"]);
		this.visuals.cannonImage.image(global.img.references[global.img.filePath + this.color + "c.png"]);
		for (let i = 0; i < this.bullets.length; i++) {
			this.bullets[i].changeColor(color);
		}
	}

	// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

	// Currently spawned by controls fire button
	spawn(x, y) {
		this.active = true;
		this.xCenter = x;
		this.yCenter = y;
		this.score = 0;
		this.updateVisuals();
	}

	randomSpawn() {
		// only randomly spawn if not alive;
		if (this.active) return;
		// randomly spawn, at least 1/4 away from the edge
		let widthMin = global.field.width / 4;
		let heightMin = global.field.height / 4;
		this.spawn( global.getRandomInt(widthMin, widthMin * 3), global.getRandomInt(heightMin, heightMin * 3) );
	}

	death(source) {
		this.effectDerezz.spawn(this.xCenter, this.yCenter, source);
		this.active = false;
		this.xCenter = -100;
		this.yCenter = -100;
		this.score = 0;
		this.updateVisuals();
		this.soundPlayDerezz();
	}

	updateVisuals() {
		// Everything is centered around the group
		this.visuals.group.x(this.xCenter);
		this.visuals.group.y(this.yCenter);
		this.visuals.group.rotation(this.bodyAngle);
		this.visuals.barrel.rotation(this.barrelAngle - this.bodyAngle);
		this.visuals.barrelGroup.rotation(this.barrelAngle - this.bodyAngle);
		this.visuals.scoreText.text("Score: " + this.score);
		this.visuals.scoreTextOutline1.text("Score: " + this.score);
		this.visuals.scoreTextOutline2.text("Score: " + this.score);
	}

	setMove(angle) {
		this.moving = true;
		this.bodyAngle = angle;
	}

	stopMoving() {
		this.moving = false;
	}

	setBarrelAngle(angle) {
		this.barrelAngle = angle;
	}

	fire() {
		if (!this.active) return;
		if (Date.now() < this.lastFireTime + this.fireDelay) return;
		this.lastFireTime = Date.now();
		for (let i = 0; i < this.bullets.length; i++) {
			if (!this.bullets[i].active) {
				let firepoint = this.visuals.firePointGroup.getAbsolutePosition();
				this.bullets[i].spawn(firepoint.x, firepoint.y, this.barrelAngle);
				this.soundPlayShot();
				break;
			}
		}
	}

	soundPlayShot() {
		this.sounds.shot.audio.currentTime = 0;
		this.sounds.shot.audio.pause();
		this.sounds.shot.audio.play();
	}

	soundPlayDerezz() {
		this.sounds.derezz.audio.currentTime = 0;
		this.sounds.derezz.audio.pause();
		this.sounds.derezz.audio.play();
	}

	// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

	update() {
		// if active
		if (this.active) {
			this.updateMove();
			this.updateCollision();
			this.updateVisuals();
		}
	}

	updateMove() {
		if (!this.moving) return;

		// based on angle, ajust movement
		let dx = global.xFromDegree(this.bodyAngle, this.speed * global.time.dt);
		let dy = global.yFromDegree(this.bodyAngle, this.speed * global.time.dt);

		this.xCenter += dx;
		this.yCenter += dy;

		// bound check
		if (this.xCenter < 0) {
			this.xCenter = 1;
		} else if (this.xCenter > global.field.width) {
			this.xCenter = global.field.width - 1;
		} else if (this.yCenter < 0) {
			this.yCenter = 1;
		} else if (this.yCenter > global.field.height) {
			this.yCenter = global.field.height - 1;
		}
	}

	updateCollision() {
		// not implemented yet
	}


} // end class
