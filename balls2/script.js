var renderer, camera, scene;
var geometry, material;

var meshes = [], bodies = [];

var world;

var init = function() {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0x3b0b39, 1 );
	document.body.appendChild( renderer.domElement );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set(20,20,20);
	camera.lookAt(new THREE.Vector3(0,0,0));

	geometry = new THREE.SphereGeometry(1, 15, 15 );
	material = new THREE.MeshBasicMaterial( { wireframe: true } );

	world = new CANNON.World();
	world.broadphase = new CANNON.NaiveBroadphase();
	world.gravity.set( 0, -150, 0 );

	var planeShape = new CANNON.Plane();
	var planeMaterial = new CANNON.Material();
	var planeBody = new CANNON.RigidBody( 0, planeShape, planeMaterial );
	planeBody.quaternion.setFromAxisAngle( new CANNON.Vec3(1,0,0), -Math.PI/2);
	world.add(planeBody);


};

var addBall = function( x, y, z ) {
	var mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	meshes.push(mesh);

	var sphereShape = new CANNON.Sphere( 1 );
	var sphereMaterial = new CANNON.Material();

	var body = new CANNON.RigidBody( 0.1, sphereShape, sphereMaterial );
	body.position.set(x,y,z);
	world.add(body);

	bodies.push(body);
}

var animate = function () {

	requestAnimationFrame( animate );

	if( meshes.length <= 100 ) {
		addBall(
			Math.random() * 10,
			Math.random() * 10,
			Math.random() * 10
		);
	}

	world.step(1/60);

	for(var i=0, j=meshes.length; i<j; i++) {
		var mesh = meshes[i], body = bodies[i];
		body.position.copy(mesh.position);
		body.quaternion.copy(mesh.quaternion);
	}

	renderer.render( scene, camera );
};

init();
animate();
