// TODO: Import three.js and OrbitControls here instead of in index.html


var Tridchessboard = function( canvasId ) {

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// Three.js
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	
	// Canvas element
	var canvas = document.getElementById( canvasId );
	var width = canvas.offsetWidth;
	var height = canvas.offsetHeight;
	console.log( "w: " + width + ", h: " + height );


	// Scene
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 60, width / height, 1, 1000 );
	camera.position.set( -10, 7, 10 );


	// Renderer
	var renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( width, height );
	renderer.setClearColor( 0xafafaf, 1 );
	document.getElementById( canvasId ).appendChild( renderer.domElement );

	
	// Controls
	var orbitControls = new THREE.OrbitControls( camera, renderer.domElement );
	orbitControls.minDistance = 2;
	orbitControls.maxDistance = 100;
	orbitControls.enablePan = false;
	orbitControls.zoomSpeed = 1.0;
	orbitControls.rotateSpeed = 1.0;
	orbitControls.minPolarAngle = 0;
	orbitControls.maxPolarAngle = Math.PI;


	// DEBUG
	var axesHelper = new THREE.AxesHelper(10);
	scene.add(axesHelper);


	// Window Resizing
	function onWindowResize() {

	width = canvas.offsetWidth;
	height = canvas.offsetHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize( width, height );

	}

	window.addEventListener( 'resize', onWindowResize, false );


	// Animation loop
	function animate() {

	requestAnimationFrame( animate );
	renderer.render( scene, camera );

	}

	animate();


	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// Tri-D-Chess
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	
	// ----------------------------------------------------------------
	// Globals and helper functions
	// ----------------------------------------------------------------
		
	// Position object: Specifies a certain square on the board
	var Pos = function( file, row, level ) {

		this.f = file;
		this.r = row;
		this.l = level;

	}
	
	function posToVector3( pos ) {

		return new THREE.Vector3( pos.r, pos.l * 2, pos.f );

	}

	
	// ----------------------------------------------------------------
	// Board
	// ----------------------------------------------------------------

	var board = new THREE.Group();
	board.position.set( -4.5, -4, -2.5 );    // Center board on origin

	scene.add( board );

	// Add board model
	// TODO: Add real board model
	var boardGeo = new THREE.BoxGeometry();
	boardGeo.translate( 0, -0.5, 0 );    // Set origin at top
	var boardMat = new THREE.MeshBasicMaterial( { color: 0x92b4ce } );

	var boardMod = new THREE.Mesh( boardGeo, boardMat );
	boardMod.position.set( 4.5, 4, 2.5 );

	board.add( boardMod );

	// ----------------------------------------------------------------
	// Squares
	// ----------------------------------------------------------------
	
	// Square Indicators
	var indGeo = new THREE.PlaneGeometry();
	indGeo.translate( 0, 0, 0.01 );    // Set origin below square
	var indMat= new THREE.MeshBasicMaterial( { color: 0xfafcb8,
											   side: THREE.DoubleSide } );

	var Square = function( name, pos ) {

		// Object3D constructor
		THREE.Object3D.apply( this );
		
		// Properties
		this.type = 'square';
		this.name = name;
		this.pos = pos;

		// Add to board
		board.add( this );

		// Position
		vec = posToVector3( pos );
		this.position.set( vec.x, vec.y, vec.z );

		// Square Indicator
		var ind = new THREE.Mesh( indGeo, indMat );
		ind.position.set( vec.x, vec.y, vec.z );
		ind.rotateX( - Math.PI / 2 );    // Rotate upright
		this.add( ind );

		// Piece
		var piece;
		this.addPiece = function( piece ) {

			// TODO: Piece class?
			//this.piece = new Piece( piece );
		
	}

	Square.prototype = Object.create( THREE.Object3D.prototype );
	Square.prototype.constructor = Square;


	// ----------------------------------------------------------------
	// Towers
	// ----------------------------------------------------------------


	// ----------------------------------------------------------------
	// Pieces
	// ----------------------------------------------------------------
	

	// ----------------------------------------------------------------
	// Selecting
	// ----------------------------------------------------------------
	

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// Public functions
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
}
