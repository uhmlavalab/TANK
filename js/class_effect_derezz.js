

class Effect_Derezz {
	constructor(color) {
		this.initValues(color);
		this.createVisuals(color);

		global.allEffects.push(this);
		global.allEntities.push(this);
	}

	// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

	initValues(color) {
		this.isEffect = true;
		this.isDerezz = true;
		this.xCenter = 0;
		this.yCenter = 0;
		this.width = 5; // Using as min max
		this.height = 20;
		if (color) {
			this.color = color;
		} else {
			this.color = "red";
		}

		this.active = false;

		// Pieces
		this.pieceInfo = {};
		this.pieceInfo.pieces = [];
		this.pieceInfo.maxPieces = 10;
		this.pieceInfo.angleMin = -45; // Based on the source
		this.pieceInfo.angleMax = 45;
		this.pieceInfo.speedMin = 10; 
		this.pieceInfo.speedMax = 200;
		this.pieceInfo.duration = 3; // seconds
		this.pieceInfo.durationCounter = 0;
	}

	createVisuals() {
		this.visuals = {};
		// Pieces based on group
		this.visuals.group = new Konva.Group({
			x: 0,
			y: 0
		});
		this.visuals.pieces = [];
		let piece;
		let pieceSize;
		for (let i = 0; i < this.pieceInfo.maxPieces; i++) {
			piece = {};
			piece.xCenter = 0;
			piece.yCenter = 0;
			piece.angleOfMovement = 0;
			piece.speed = global.getRandomInt(this.pieceInfo.speedMin, this.pieceInfo.speedMax);
			piece.rotationChangePerFrame = Math.random() * 6 - 3; // between -1.5 and 1.5
			pieceSize = global.getRandomInt(20, 80);
			piece.visual = new Konva.Rect({
				x: 0,
				y: 0,
				width: pieceSize,
				height: pieceSize,
				fill: this.color,
				stroke: 'black',
				strokeWidth: 2
			});
			this.visuals.pieces.push(piece.visual);
			this.pieceInfo.pieces.push(piece);
			this.visuals.group.add(piece.visual);
		}
		this.visuals.group.x(-100);
		this.visuals.group.y(-100);
		global.konva.layerMiddleGround.add(this.visuals.group);
	}

	changeColor(color) {
		this.color = color;
		for (let i = 0; i < this.visuals.pieces.length; i++) {
			this.visuals.pieces[i].fill(color);
		}
	}

	// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

	// Currently spawned by controls fire button
	spawn(x, y, source = false) {
		this.active = true;
		this.xCenter = x;
		this.yCenter = y;
		this.pieceInfo.durationCounter = 0;
		// Place all the pieces
		for (let i = 0; i < this.pieceInfo.pieces.length; i++) {
			this.pieceInfo.pieces[i].xCenter = 0; // their offset from the group
			this.pieceInfo.pieces[i].yCenter = 0;
			if (source) {
				this.pieceInfo.pieces[i].angleOfMovement = global.getRandomInt(source.angle + this.pieceInfo.angleMin, source.angle + this.pieceInfo.angleMax);
			} else {
				this.pieceInfo.pieces[i].angleOfMovement = global.getRandomInt(0, 360);
			}
		}
		this.updateVisuals();
	}

	death() {
		this.active = false;
		this.xCenter = -100;
		this.yCenter = -100;
		// reset all pieces
		for (let i = 0; i < this.pieceInfo.pieces.length; i++) {
			this.pieceInfo.pieces[i].xCenter = 0;
			this.pieceInfo.pieces[i].yCenter = 0;
		}
		this.updateVisuals();
	}

	updateVisuals() {
		// Everything is centered around the group
		this.visuals.group.x(this.xCenter);
		this.visuals.group.y(this.yCenter);
		for (let i = 0; i < this.pieceInfo.pieces.length; i++) {
			this.pieceInfo.pieces[i].visual.x(this.pieceInfo.pieces[i].xCenter);
			this.pieceInfo.pieces[i].visual.y(this.pieceInfo.pieces[i].yCenter);
			this.pieceInfo.pieces[i].visual.rotate(this.pieceInfo.pieces[i].rotationChangePerFrame);
			if (this.active) {
				let opacityCalc = (this.pieceInfo.duration - this.pieceInfo.durationCounter) / this.pieceInfo.duration;
				opacityCalc = Math.floor(opacityCalc * 10) / 10;
				this.pieceInfo.pieces[i].visual.opacity(opacityCalc);
			} else {
				this.pieceInfo.pieces[i].visual.opacity(1);
			}
		}
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
		this.pieceInfo.durationCounter += global.time.dt;
		// Remove if end of duration
		if (this.pieceInfo.durationCounter > this.pieceInfo.duration) {
			this.death();
		}
		// For each piece, update its location
		let piece, dx, dy;
		for (let i = 0; i < this.pieceInfo.pieces.length; i++) {
			piece = this.pieceInfo.pieces[i];
			dx = global.xFromDegree(piece.angleOfMovement, piece.speed * global.time.dt);
			dy = global.yFromDegree(piece.angleOfMovement, piece.speed * global.time.dt);
			piece.xCenter += dx;
			piece.yCenter += dy;
		}
	}

	updateCollision() {
		// not implemented yet
	}

} // end class
