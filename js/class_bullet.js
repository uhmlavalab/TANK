

class Bullet {
	
	constructor(owner) {
		this.initValues(owner);
		this.createVisuals();

		global.allBullets.push(this);
		global.allEntities.push(this);
	}

	// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

	initValues(owner) {
		this.owner = owner;
		this.isBullet = true;

		this.xCenter = -100;
		this.yCenter = -100;
		this.width = 50;
		this.height = 50;
		if (owner.color) {
			this.color = owner.color;
		} else {
			this.color = "red";
		}

		this.active = false;
		this.angle = 0;
		this.speed = 300;

		// visuals change
		this.visualAnimation = {};
		this.visualAnimation.delay = 200; // ms
		this.visualAnimation.lastUpdate = Date.now(); // ms
		this.visualAnimation.currentAngle = 20; // ms
		this.visualAnimation.incrementAngle = 10; // ms
		this.visualAnimation.maxAngle = 360; // ms

		this.bounceLimit = 3;
		this.bounceCount = 0;
	}

	createVisuals() {
		this.visuals = {};
		this.visuals.group = new Konva.Group({
			x: 0,
			y: 0
		});
		this.visuals.body = new Konva.Circle({
      x: 0,
      y: 0,
      // x: -1 * this.width / 2,
      // y: -1 * this.width / 2,
      radius: this.width,
      fill: this.color,
      stroke: 'black',
      strokeWidth: 4
		});
		this.visuals.bodyImage = new Konva.Image({
      x: -1 * this.width,
      y: -1 * this.width,
			image: global.img.references[global.img.filePath + this.color + "b.png"],
			width: this.width * 2, // circles use radius, making the width 2x radius
			height: this.height * 2
		});
		// images need to be cached before applying filters
		this.visuals.bodyImage.cache(); // ({drawBorder: true});
		this.visuals.bodyImage.filters([Konva.Filters.Kaleidoscope]);
		this.visuals.bodyImage.kaleidoscopePower(3);
		// Add to group, then layer
		this.visuals.group.add(this.visuals.body);
		this.visuals.group.add(this.visuals.bodyImage);
		global.konva.layerForeground.add(this.visuals.group);
		this.updateVisuals();
	}

	// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

	spawn(x, y, angle) {
		this.active = true;
		this.xCenter = x;
		this.yCenter = y;
		this.angle = angle;
		this.updateVisuals();
	}

	death() {
		this.active = false;
		this.xCenter = -100;
		this.yCenter = -100;
		this.updateVisuals();
	}

	changeColor(color) {
		this.color = color;
		this.visuals.body.fill(color);
		this.visuals.bodyImage.image(global.img.references[global.img.filePath + this.color + "b.png"]);
		this.visuals.bodyImage.cache();
	}

	updateVisuals() {
		this.visuals.group.x(this.xCenter);
		this.visuals.group.y(this.yCenter);
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
		// based on angle, ajust movement
		let dx = global.xFromDegree(this.angle, this.speed * global.time.dt);
		let dy = global.yFromDegree(this.angle, this.speed * global.time.dt);

		this.xCenter += dx;
		this.yCenter += dy;

		// bound check
		if(
			(this.xCenter < 0)
			|| (this.xCenter > global.field.width)
			|| (this.yCenter < 0)
			|| (this.yCenter > global.field.height)
		) {
			this.death();
		}

		// visuals update
		if (Date.now() > this.visualAnimation.lastUpdate + this.visualAnimation.delay) {
			this.visualAnimation.lastUpdate = Date.now();
			this.visualAnimation.currentAngle += this.visualAnimation.incrementAngle;
			if (this.visualAnimation.currentAngle > this.visualAnimation.maxAngle) {
				this.visualAnimation.currentAngle = 0;
			}
			this.visuals.bodyImage.kaleidoscopeAngle(this.visualAnimation.currentAngle);
		}
	}

	updateCollision() {
		if (!this.active) return; // Return if this is not active
		let e, dist;
		// for each entity
		for (let i = 0; i < global.allEntities.length; i++) {
			e = global.allEntities[i];
			// if entity is not active, move onto the next one
			if (!e.active) continue;
			// if not this or the owner, must be a tank or bullet
			if ((e != this) && (e != this.owner) && (e.isTank || e.isBullet)) {
				// check the distance between this and the entity
				dist = global.distanceBetween(this.xCenter, this.yCenter, e.xCenter, e.yCenter);
				if (dist < (this.width + e.width / 2) ) {
					if (e.isTank) {
						this.owner.score++;
					}
					this.death();
					e.death(this);
					break;
				}
			}
		}
	}


} // end class
