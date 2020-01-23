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


	// Squares
	var MAIN_SQUARES = [ 
		// Low board 
		new Pos(1,1,0), new Pos(2,1,0), new Pos(3,1,0), new Pos(4,1,0),
		new Pos(1,2,0), new Pos(2,2,0), new Pos(3,2,0), new Pos(4,2,0),
		new Pos(1,3,0), new Pos(2,3,0), new Pos(3,3,0), new Pos(4,3,0),
		new Pos(1,4,0), new Pos(2,4,0), new Pos(3,4,0), new Pos(4,4,0),

		// Middle board
		new Pos(1,3,2), new Pos(2,3,2), new Pos(3,3,2), new Pos(4,3,2),
		new Pos(1,4,2), new Pos(2,4,2), new Pos(3,4,2), new Pos(4,4,2),
		new Pos(1,5,2), new Pos(2,5,2), new Pos(3,5,2), new Pos(4,5,2),
		new Pos(1,6,2), new Pos(2,6,2), new Pos(3,6,2), new Pos(4,6,2),

		// High board
		new Pos(1,5,4), new Pos(2,5,4), new Pos(3,5,4), new Pos(4,5,4),
		new Pos(1,6,4), new Pos(2,6,4), new Pos(3,6,4), new Pos(4,6,4),
		new Pos(1,7,4), new Pos(2,7,4), new Pos(3,7,4), new Pos(4,7,4),
		new Pos(1,8,4), new Pos(2,8,4), new Pos(3,8,4), new Pos(4,8,4)
	];

	var TOWER_SQUARES = [
		// Low board 
		[ new Pos(0,0,1), new Pos(1,0,1), new Pos(0,1,1), new Pos(1,1,1) ],
		[ new Pos(4,0,1), new Pos(5,0,1), new Pos(4,1,1), new Pos(5,1,1) ],
		[ new Pos(0,4,1), new Pos(1,4,1), new Pos(0,5,1), new Pos(1,5,1) ],
		[ new Pos(4,4,1), new Pos(5,4,1), new Pos(4,5,1), new Pos(5,5,1) ],

		// Middle board
		[ new Pos(0,2,3), new Pos(1,2,3), new Pos(0,3,3), new Pos(1,3,3) ],
		[ new Pos(4,2,3), new Pos(5,2,3), new Pos(4,3,3), new Pos(5,3,3) ],
		[ new Pos(0,6,3), new Pos(1,6,3), new Pos(0,7,3), new Pos(1,7,3) ],
		[ new Pos(4,6,3), new Pos(5,6,3), new Pos(4,7,3), new Pos(5,7,3) ],

		// High board
		[ new Pos(0,4,5), new Pos(1,4,5), new Pos(0,5,5), new Pos(1,5,5) ],
		[ new Pos(4,4,5), new Pos(5,4,5), new Pos(4,5,5), new Pos(5,5,5) ],
		[ new Pos(0,8,5), new Pos(1,8,5), new Pos(0,9,5), new Pos(1,9,5) ],
		[ new Pos(4,8,5), new Pos(5,8,5), new Pos(4,9,5), new Pos(5,9,5) ]
	];



	
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
		var piece = null;

		this.getPiece = function() { return piece }
		this.setPiece = function( pieceName ) {

			if ( pieceName !== null ) {

				console.log("Add piece");
				piece = new Piece( pieceName );
				this.add( piece );

			} else {

				console.log("Remove piece");
				this.remove( piece );
				piece = null
			}

		}
		
	}

	Square.prototype = Object.create( THREE.Object3D.prototype );
	Square.prototype.constructor = Square;


	// ----------------------------------------------------------------
	// Towers
	// ----------------------------------------------------------------


	// ----------------------------------------------------------------
	// Pieces
	// ----------------------------------------------------------------

	var Piece = function( name ) {

		// Object3D constructor
		THREE.Object3D.apply( this );

		// Properties
		this.type = 'piece';
		this.name = name;

	}

	Piece.prototype = Object.create( THREE.Object3D.prototype );
	Piece.prototype.constructor = Piece;
	

	// ----------------------------------------------------------------
	// Selecting
	// ----------------------------------------------------------------
	

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// Public functions
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	

	// DEBUG
	var dbg_pos = new Pos(0,0,1);
	var dbg_square = new Square("b3_3", dbg_pos);
	dbg_square.setPiece("wK");
	console.log(dbg_square);
	console.log(dbg_square.type);
	console.log(dbg_square.name);
	console.log(dbg_square.pos);
	console.log(dbg_square.getPiece());
}
