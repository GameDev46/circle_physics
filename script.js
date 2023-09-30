import { piCollide } from "/piCollide.js";

// Setup scene

piCollide.setupScene("#131313");

// Movement

function processMovement(delta) {
	let speed = 1000;

	if (piCollide.keyboard["W"]) piCollide.camera.position.y -= speed * delta;
	if (piCollide.keyboard["S"]) piCollide.camera.position.y += speed * delta;

	if (piCollide.keyboard["A"]) piCollide.camera.position.x -= speed * delta;
	if (piCollide.keyboard["D"]) piCollide.camera.position.x += speed * delta;
}

function effectCircles(delta) {

	if (piCollide.mouse.isDown[2]) {

		for (let x = 0; x < piCollide.objects.length; x++) {

			worldCenter.position.set(piCollide.mouse.position.x, piCollide.mouse.position.y);
			piCollide.attract(worldCenter, piCollide.objects[x], 100, delta * 100);

		}

	}
}

let lastSpawnTime = 0;

function spawnInBallsOnClick() {

	if (piCollide.mouse.isDown[0]) {

		if (Date.now() - lastSpawnTime < 50) {
			return;
		}

		lastSpawnTime = Date.now();

		let r = (Math.random() + 1) * 2;

		if (scene == 2 || scene == 3 || scene == 4) {
			r = (Math.random() + 1) * 10;
		}

		let circleObject = piCollide.circleGeometry({
			radius: r,
			mass: r * 20,
			colour: piCollide.rgba(Math.round(Math.max(130, Math.random() * 255)), Math.round(Math.max(130, Math.random() * 255)), Math.round(Math.max(130, Math.random() * 255)), 1),
			bounce: 0.95,
			effects: {
				bloom: {
					strength: 0.2,
					diffuse: 3
				}
			}
		});

		if (scene == 4) {
			// Add a bounding box

			circleObject.boundingBox = {
				active: true,
				center: {
					x: 0,
					y: 0
				},
				scale: scene4BoundingBoxScale
			}

			circleObject.mass = circleObject.radius * 2;

		}

		circleObject.position = piCollide.mouse.position;
		circleObject.minDistance = 3;

		piCollide.addObject(circleObject);
	}

}

// Create objects

let bridges = [];
let ropes = [];

let gravitationalConstant = 0.001;

let scene4BoundingBoxScale = {
	x: piCollide.canvas.width,
	y: piCollide.canvas.height
}

let scene = 2

function loadInScene(sceneID) {

	scene = sceneID

	piCollide.camera.position.set(0, 0);

	if (scene == 1) {

		// Planet formation simulation

		piCollide.gravity = 0;
		piCollide.drag = 1;

		piCollide.colourBasedOnPressure = true;
		piCollide.colourBasedOnVelocity = true;

		let size = 25;
		let maxVel = 60;
		let spacing = 50

		let centerPos = {
			x: piCollide.canvas.width / 2,
			y: piCollide.canvas.height / 2
		}


		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {

				let r = (Math.random() + 1) * 2;

				let circleObject = piCollide.circleGeometry({
					radius: r,
					mass: r * 20,
					colour: piCollide.rgba(255, 255, 255, 1),
					bounce: 0.95,
					effects: {
						bloom: {
							strength: 0.2,
							diffuse: 3
						}
					}
				});

				circleObject.position.set((x * spacing) + centerPos.x - (size * spacing * 0.5), (y * spacing) + centerPos.y - (size * spacing * 0.5));
				circleObject.velocity.set((Math.random() * maxVel * 2) - maxVel, (Math.random() * maxVel * 2) - maxVel);

				circleObject.minDistance = 3;

				piCollide.addObject(circleObject);

			}
		}
	} else if (scene == 2) {
		// Bridge playground

		bridges = [];
		ropes = [];

		piCollide.gravity = 9.81;
		piCollide.drag = 0.99;

		piCollide.colourBasedOnPressure = false;
		piCollide.colourBasedOnVelocity = false;

		let centerPos = {
			x: piCollide.canvas.width / 2,
			y: piCollide.canvas.height / 2
		}

		let bridgePiece = piCollide.circleGeometry({
			radius: 3,
			mass: 50,
			colour: piCollide.rgba(255, 255, 255, 1),
			bounce: 0.95,
			effects: {
				bloom: {
					strength: 1,
					diffuse: 3
				}
			}
		});

		bridges.push(piCollide.createBridge({
			piece: bridgePiece,
			length: 50,
			spacing: 7,
			startPosition: { x: centerPos.x - 200, y: centerPos.y + 100 },
			angle: 0
		}));

		// Diagonal bridge left

		bridges.push(piCollide.createBridge({
			piece: bridgePiece,
			length: 25,
			spacing: 10,
			startPosition: { x: centerPos.x - 450, y: centerPos.y - 150 },
			angle: 0
		}));

		// Floor Bridge

		bridges.push(piCollide.createBridge({
			piece: bridgePiece,
			length: 100,
			spacing: 12,
			startPosition: { x: centerPos.x - 700, y: centerPos.y + 350 },
			angle: 0
		}));

		// Ropes

		let ropesPiece = piCollide.circleGeometry({
			radius: 2,
			mass: 100,
			colour: piCollide.rgba(255, 255, 255, 1),
			bounce: 0.95,
			effects: {
				bloom: {
					strength: 1,
					diffuse: 3
				}
			}
		});

		ropes.push(piCollide.createRope({
			piece: ropesPiece,
			length: 40,
			spacing: 4,
			startPosition: { x: centerPos.x - 500, y: centerPos.y - 350 },
			angle: 145
		}));

		ropes.push(piCollide.createRope({
			piece: ropesPiece,
			length: 60,
			spacing: 4,
			startPosition: { x: centerPos.x + 170, y: centerPos.y - 150 },
			angle: 45
		}));

	} else if (scene == 3) {
		// Momentum playground

		bridges = [];
		ropes = [];

		piCollide.gravity = 9.81;
		piCollide.drag = 0.99;

		piCollide.colourBasedOnPressure = false;
		piCollide.colourBasedOnVelocity = false;

		let centerPos = {
			x: piCollide.canvas.width / 2,
			y: piCollide.canvas.height / 2
		}

		let bridgePiece = piCollide.circleGeometry({
			radius: 3,
			mass: 50,
			colour: piCollide.rgba(255, 255, 255, 1),
			bounce: 0.95,
			effects: {
				bloom: {
					strength: 1,
					diffuse: 3
				}
			}
		});

		bridges.push(piCollide.createBridge({
			piece: bridgePiece,
			length: 40,
			spacing: 15,
			startPosition: { x: centerPos.x - 400, y: centerPos.y - 200 },
			angle: 50
		}));

		bridges.push(piCollide.createBridge({
			piece: bridgePiece,
			length: 40,
			spacing: 15,
			startPosition: { x: centerPos.x + 300, y: centerPos.y + 200 },
			angle: 130
		}));

		bridges.push(piCollide.createBridge({
			piece: bridgePiece,
			length: 40,
			spacing: 15,
			startPosition: { x: centerPos.x - 400, y: centerPos.y + 600 },
			angle: 50
		}));

		// Create net at bottom

		bridges.push(piCollide.createBridge({
			piece: bridgePiece,
			length: 150,
			spacing: 7,
			startPosition: { x: centerPos.x - 500, y: centerPos.y + 1200 },
			angle: 0
		}));

	} else if (scene == 4) {

		piCollide.gravity = 9.81;
		piCollide.drag = 0.99;

		piCollide.colourBasedOnPressure = false;
		piCollide.colourBasedOnVelocity = false;

		let particleCount = 500;

		for (let i = 0; i < particleCount; i++) {

			let r = (Math.random() + 1) * 10;

			let circleObject = piCollide.circleGeometry({
				radius: r,
				mass: r * 2,
				colour: piCollide.rgba(Math.round(Math.max(130, Math.random() * 255)), Math.round(Math.max(130, Math.random() * 255)), Math.round(Math.max(130, Math.random() * 255)), 1),
				bounce: 0.99,
				boundingBox: {
					active: true,
					center: {
						x: 0,
						y: 0
					},
					scale: scene4BoundingBoxScale
				}
			});

			circleObject.position.set(Math.random() * piCollide.canvas.width, Math.random() * piCollide.canvas.height);
			piCollide.addObject(circleObject);

		}
	} else if (scene == 5) {

		// Planet formation simulation

		piCollide.gravity = 0;
		piCollide.drag = 1;

		piCollide.colourBasedOnPressure = true;
		piCollide.colourBasedOnVelocity = true;

		let massOfDenseObject = 50000;

		let planetCount = 20;

		let centerPos = {
			x: piCollide.canvas.width / 2,
			y: piCollide.canvas.height / 2
		}

		let angle = 0;

		for (let x = 0; x < planetCount; x++) {

			let circleObject = piCollide.circleGeometry({
				radius: 5,
				mass: 1,
				colour: piCollide.rgba(255, 255, 255, 1),
				bounce: 0.95,
				effects: {
					bloom: {
						strength: 0.2,
						diffuse: 3
					}
				}
			});

			let radians = piCollide.degreesToRadians(angle);
			let velocityRadians = radians + (Math.PI / 2)

			let distanceFromCenter = (Math.random() + 1) * 200;
			let vel = ((2 * gravitationalConstant * massOfDenseObject) / distanceFromCenter ^ 2) * 1000;

			if (Math.round(Math.random() * 1) == 0) vel *= -1;

			circleObject.position.set((distanceFromCenter * Math.cos(radians)) + centerPos.x, (distanceFromCenter * Math.sin(radians)) + centerPos.y);
			circleObject.velocity.set(vel * Math.cos(velocityRadians), vel * Math.sin(velocityRadians));

			circleObject.minDistance = 3;

			piCollide.addObject(circleObject);

			angle += 360 / planetCount;
		}

		// Add dense object at center

		let denseObject = piCollide.circleGeometry({
			radius: 2,
			mass: massOfDenseObject,
			colour: piCollide.rgba(255, 255, 255, 1),
			bounce: 0.95,
			effects: {
				bloom: {
					strength: 0.2,
					diffuse: 3
				}
			}
		});

		denseObject.position.set(centerPos.x, centerPos.y);
		denseObject.velocity.set(0, 0);

		denseObject.minDistance = 0;

		piCollide.addObject(denseObject);

	}

}

// Listen for scene change

document.getElementById("sceneSelect").addEventListener("change", e => {
	let scene = Number(document.getElementById("sceneSelect").value);

	piCollide.objects = [];
	loadInScene(scene);
})

function scene1Physics(delta) {
	for (let x = 0; x < piCollide.objects.length; x++) {
		for (let y = 0; y < piCollide.objects.length; y++) {
			piCollide.attract(piCollide.objects[x], piCollide.objects[y], gravitationalConstant, delta);
		}
	}
}

function scene2Physics(delta) {
	// Connect the particles in the bridge

	for (let x = 0; x < bridges.length; x++) {
		for (let y = 0; y < bridges[x].length - 1; y++) {
			piCollide.distanceJoint(bridges[x][y], bridges[x][y + 1], 1.5, delta);
		}
	}

	// Connect the particles in the rope

	for (let x = 0; x < ropes.length; x++) {
		for (let y = 0; y < ropes[x].length - 1; y++) {
			piCollide.distanceJoint(ropes[x][y], ropes[x][y + 1], 1.8, delta);
		}
	}

}

function scene3Physics(delta) {
	// Connect the particles in the bridge

	for (let x = 0; x < bridges.length; x++) {
		for (let y = 0; y < bridges[x].length - 1; y++) {
			piCollide.distanceJoint(bridges[x][y], bridges[x][y + 1], 1.5, delta);
		}
	}

}

function scene5Physics(delta) {
	for (let x = 0; x < piCollide.objects.length; x++) {
		for (let y = 0; y < piCollide.objects.length; y++) {
			piCollide.attract(piCollide.objects[x], piCollide.objects[y], gravitationalConstant, delta);
		}
	}
}

// Game loop

loadInScene(2)

let worldCenter = piCollide.emptyObject();

worldCenter.position.set(300, 300);
worldCenter.minDistance = 5;
worldCenter.mass = 100;

let physicsSubSteps = [0, 1, 2, 2, 3, 1];

function worldUpdate() {

	let delta = piCollide.calculateDelta();

	delta = delta / physicsSubSteps[scene];

	processMovement(delta);
	effectCircles(delta);

	// Check if user is pressing right click
	spawnInBallsOnClick();

	for (let i = 0; i < physicsSubSteps[scene]; i++) {

		if (scene == 1) {
			scene1Physics(delta);
		} else if (scene == 2) {
			scene2Physics(delta);
		} else if (scene == 3) {
			scene3Physics(delta);
		} else if (scene == 5) {
			scene5Physics(delta);
		}

		piCollide.updatePhysics(delta);
		piCollide.updatePositions(delta);
	}

	piCollide.renderScene();

	requestAnimationFrame(worldUpdate);
}

requestAnimationFrame(worldUpdate);

