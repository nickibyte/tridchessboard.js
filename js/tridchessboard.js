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

	
	// Orbit controls
	var orbitControls = new THREE.OrbitControls( camera, renderer.domElement );
	orbitControls.minDistance = 2;
	orbitControls.maxDistance = 100;
	orbitControls.enablePan = false;
	orbitControls.zoomSpeed = 1.0;
	orbitControls.rotateSpeed = 1.0;
	orbitControls.minPolarAngle = 0;
	orbitControls.maxPolarAngle = Math.PI;


	// Drag controls
	var draggable = [];
	var selected, target = null;

	var dragControls = new THREE.DragControls(draggable, camera, renderer.domElement);

	dragControls.addEventListener( 'dragstart', function( event ) {

		orbitControls.enabled = false;

		// Get selected object
		selected = event.object;

		// DEBUG
		console.log( "Selected: " );
		console.log( selected );

	} );

	dragControls.addEventListener( 'dragend', function( event ) {

		orbitControls.enabled = true;

		// TODO: Get target object

		// DEBUG
		console.log( "Target: " );
		console.log( target );

	} );
	

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

	var TOWER_POSITIONS = [ 
		new Pos(0.5,0.5,0),
		new Pos(4.5,0.5,0),
		new Pos(0.5,4.5,0),
		new Pos(4.5,4.5,0),
		new Pos(0.5,2.5,2),
		new Pos(4.5,2.5,2),
		new Pos(0.5,6.5,2),
		new Pos(4.5,6.5,2),
		new Pos(0.5,4.5,4),
		new Pos(4.5,4.5,4),
		new Pos(0.5,8.5,4),
		new Pos(4.5,8.5,4)
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
	
	// Defaults
	var DEFAULT_SQU_IND_COLOR = 0xfafcb8;
	var DEFAULT_SQU_IND_OPACITY = 0.85;


	// Square Indicators
	var squIndGeo = new THREE.PlaneGeometry();
	squIndGeo.translate( 0, 0, 0.01 );    // Set origin below square

	var squIndMat= new THREE.MeshBasicMaterial();
	squIndMat.color = DEFAULT_SQU_IND_COLOR;
	squIndMat.transparent = true;
	squIndMat.opacity = DEFAULT_SQU_IND_OPACITY;
	squIndMat.side = THREE.DoubleSide;


	var Square = function( name, pos ) {

		// Object3D constructor
		THREE.Object3D.apply( this );
		
		// Properties
		this.type = 'square';
		this.name = name;
		this.pos = pos;

		// Position
		var vec = posToVector3( pos );
		this.position.set( vec.x, vec.y, vec.z );

		// Square Indicator
		var mat = squIndMat.clone();
		var ind = new THREE.Mesh( squIndGeo, mat );
		ind.rotateX( - Math.PI / 2 );    // Rotate upright
		ind.material.visible = false;
		this.add( ind );

		// Piece
		var piece = null;

		this.getPiece = function() { return piece }
		this.setPiece = function( piece ) {

			if ( piece !== null ) {

				piece = new Piece( piece );
				this.add( piece );

			} else {

				this.remove( piece );
				piece = null
			}

		}

		// Highlight
		this.highlight = function( color = DEFAULT_SQU_IND_COLOR ) {
		
			// Highlight indicator
			ind.material.visible = true;
			color = new THREE.Color( color );
			ind.material.color = color;

			// TODO: Highlight piece

		}

		this.unhighlight = function() { ind.material.visible = false; }

	}

	Square.prototype = Object.create( THREE.Object3D.prototype );
	Square.prototype.constructor = Square;


	// Create squares for main boards
	for ( let squ = 0; squ < MAIN_SQUARES.length; squ++ ) {

		// Get position
		let pos = MAIN_SQUARES[ squ ];
		let name = 'abcdef'.charAt(pos.f) + (pos.r + 1) + '_' + (pos.l + 1);
	 
		// Add square
		let square = new Square( name, pos );
		board.add( square );

		// DEBUG
		square.highlight();
		
	}

	
	// ----------------------------------------------------------------
	// Towers
	// ----------------------------------------------------------------

	// Defaults
	var DEFAULT_TOW_IND_COLOR = 0x9cc5d6;
	var DEFAULT_TOW_IND_OPACITY = 0.75;


	// Tower model
	// TODO: Add real tower model
	var towGeo = new THREE.BoxGeometry( 0.25, 2, 0.25 );
	towGeo.translate( 0, 1, 0 );    // Set origin at bottom
	var towMat = new THREE.MeshBasicMaterial( { color: 0xff000 } );


	// Tower indicator
	var towIndGeo = new THREE.BoxGeometry( 2, 2, 2 );
	towIndGeo.translate( 0, 1, 0 );    // Set origin at bottom
	var towIndMat = new THREE.MeshBasicMaterial();
	towIndMat.color = DEFAULT_TOW_IND_COLOR;
	towIndMat.transparent = true;
	towIndMat.opacity = DEFAULT_TOW_IND_OPACITY;


	// Tower object
	var Tower = function( name, pos, squares ) {

		// Object3D constructor
		THREE.Object3D.apply( this );
		
		// Properties
		this.type = 'tower';
		this.name = name;
		this.pos = pos;    // Integer

		// Position
		var vec = posToVector3( TOWER_POSITIONS[ pos -1 ] );
		this.position.set( vec.x, vec.y, vec.z );

		// Active/inactive
		this.active = false;    // TODO: Make private somehow

		this.activate = function() { 

			this.active = true; 
			this.visible = true; 

		}

		this.deactivate = function() { 

			this.active = false;
			this.visible = false; 

		}

		// Tower model
		var model = new THREE.Mesh( towGeo, towMat );
		this.add( model );

		// TODO: Make draggable

		// Tower Indicator
		var mat = towIndMat.clone();
		var ind = new THREE.Mesh( towIndGeo, mat );
		ind.material.visible = false;
		this.add( ind );

		// Squares
		this.squares = squares;

		for ( let squ = 0; squ < this.squares.length; squ++ ) {

			this.add( this.squares[ squ ] );

			// Convert Square position to Tower space
			this.squares[ squ ].position.sub( this.position );

			// DEBUG
			this.squares[ squ ].highlight();
		}

		// Highlight
		this.highlight = function( color = DEFAULT_TOW_IND_COLOR ) {
		
			// Highlight indicator
			ind.material.visible = true;
			color = new THREE.Color( color );
			ind.material.color = color;

		}

		this.unhighlight = function() { ind.material.visible = false; }

	}

	Tower.prototype = Object.create( THREE.Object3D.prototype );
	Tower.prototype.constructor = Tower;


	// Add towers
	for ( let tow = 0; tow < TOWER_SQUARES.length; tow++ ) {

		let squares = [];

		for ( let squ = 0; squ < TOWER_SQUARES[ tow ].length; squ++ ) {

			// Get position
			let pos = TOWER_SQUARES[ tow ][ squ ];
			let name = 'abcdef'.charAt(pos.f) + (pos.r + 1) + '_' + (pos.l + 1);
		 
			// Add square
			let square = new Square( name, pos );
			squares.push( square );
			
		}
		
		let pos = tow + 1;
		let name = 'T' + pos;

		// Add tower
		let tower = new Tower( name, pos, squares );
		board.add( tower );

	}


	// ----------------------------------------------------------------
	// Pieces
	// ----------------------------------------------------------------

	// TODO: Add real piece models
	var pieces = [];
	var pieHeight = 1.25;

	function pieGeo( height ) {

		var pieGeo = new THREE.BoxGeometry( 0.5, height, 0.5 );
		pieGeo.translate( 0, height / 2, 0 );    // Set Origin at bottom

		return pieGeo;

	}

	var pieMatWhite = new THREE.MeshBasicMaterial( { color: 0xededed } );
	var pieMatBlack = new THREE.MeshBasicMaterial( { color: 0x0c0c0c } );

	// Pieces: Pawn, Knight, Bishop, Rook, Queen, King
	// White: uppercase, Black: lowercase
	var pieModels = {

		P: [ pieGeo( 0.60 ), pieMatWhite ],
		N: [ pieGeo( 0.90 ), pieMatWhite ],
		B: [ pieGeo( 1.00 ), pieMatWhite ],
		R: [ pieGeo( 0.80 ), pieMatWhite ],
		Q: [ pieGeo( 1.20 ), pieMatWhite ],
		K: [ pieGeo( 1.25 ), pieMatWhite ],
		p: [ pieGeo( 0.60 ), pieMatBlack ],
		n: [ pieGeo( 0.90 ), pieMatBlack ],
		b: [ pieGeo( 1.00 ), pieMatBlack ],
		r: [ pieGeo( 0.80 ), pieMatBlack ],
		q: [ pieGeo( 1.20 ), pieMatBlack ],
		k: [ pieGeo( 1.25 ), pieMatBlack ] 

	};


	// Piece object
	var Piece = function( name ) {

		// Mesh constructor
		// TODO: Load real models
		var geo = pieModels[ name ][ 0 ];
		var mat = pieModels[ name ][ 1 ];
		THREE.Mesh.apply( this, [ geo, mat ] );
		
		// Properties
		this.type = 'piece';
		this.name = name;

		// Make draggable
		draggable.push( this );
		
	}

	Piece.prototype = Object.create( THREE.Mesh.prototype );
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
	var square = board.getObjectByName( 'b4_4', true );
	square.setPiece( 'k' );
	//square.unhighlight();
	//console.log( square );
	//console.log( square.getPiece() );
	var tower = board.getObjectByName( 'T4', true );
	//tower.position.set(4.5, 4.5, 4.5);
	//tower.deactivate();
	tower.highlight();

}
