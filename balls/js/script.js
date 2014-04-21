'use strict';

var renderer, scene, camera, controls;
var geometry, material;

var world;

var sphereShape, cMaterial;

function init() {
	//renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x52026e, 1);
	document.body.appendChild(renderer.domElement);

	//scene
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 1, 1000);
	camera.position.set(0,-50,200);
	camera.lookAt(new THREE.Vector3(0,0,0));

	controls = new THREE.TrackballControls(camera);
	controls.noZoom = false;
	controls.noPan = false;
	controls.noRotate = false;
	controls.keys = [65, 83, 32];
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;

	//world
	world = new CANNON.World();
	world.broadphase = new CANNON.NaiveBroadphase();
	world.gravity.set(0,-100,0);

	//sphere
	geometry = new THREE.SphereGeometry(1, 32, 32);
	material = new THREE.MeshBasicMaterial({
		wireframe: true,
	});

	sphereShape = new CANNON.Sphere(1);
	cMaterial = new CANNON.Material('slipperyMaterial');

	var planeShape = new CANNON.Plane();

	var planeBody1 = new CANNON.RigidBody(0, planeShape, cMaterial);
	planeBody1.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), -Math.PI/2);
	planeBody1.position.set(25,0,0);
	world.add(planeBody1);

	var planeBody2 = new CANNON.RigidBody(0, planeShape, cMaterial);
	planeBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), Math.PI/2);
	planeBody2.position.set(-25,0,0);
	world.add(planeBody2);


	var planeBody3 = new CANNON.RigidBody(0, planeShape, cMaterial);
	planeBody3.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI/2);
	planeBody3.position.set(0,-25,0);
	world.add(planeBody3);

	var planeBody4 = new CANNON.RigidBody(0, planeShape, cMaterial);
	planeBody4.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), Math.PI/2);
	planeBody4.position.set(0,25,0);
	world.add(planeBody4);

}

function createSphere(x , y, z) {
	var mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	var sphereBody = new CANNON.RigidBody(1, sphereShape, cMaterial);
	sphereBody.position.set(x, y, z);
	world.add(sphereBody);
}

function update() {
	if(scene.children.length < 200) {
		createSphere(Math.random() * 10, 10 + Math.random() * 10, Math.random() * 10);
	}

	var rand = Math.random() * 100 - Math.random() * 100;

	world.gravity.set( rand - rand * rand / 100, rand, 0);

	for(var i=0,j=scene.children.length;i<j;i++) {
		world.bodies[i].position.copy(scene.children[i].position);
		world.bodies[i].quaternion.copy(scene.children[i].quaternion);
	}

	world.step(1.0/60);
}

function animate() {
	window.requestAnimationFrame(animate);

	//update
	update();

	controls.update();

	//rendering stuff
	renderer.render(scene, camera);
}

init();
animate();