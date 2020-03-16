// TODO: Import three.js and OrbitControls here instead of in index.html

// TODO: Clean up (maybe) ugly async code
var Tridchessboard = async function( canvasId ) {

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// Three.js
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	// Canvas element
	var canvas = document.getElementById( canvasId );
	var width = canvas.offsetWidth;
	var height = canvas.offsetHeight;


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


	// GLTFLoader for model loading
	var loader = new THREE.GLTFLoader();

	// TODO: Use async as intended instead of circumventing it
	// Function to handle async model loading synchronously
	function loadModel( path, offset = new THREE.Vector3( 0, 0, 0 ) ) {

		return new Promise( function ( resolve, reject ) {

			loader.load( path, function ( gltf ) {

				var mesh = gltf.scene.children[ 0 ];
				mesh.position.set( offset.x, offset.y, offset.z );

				resolve( mesh );

			}, undefined, function ( error ) { reject( error ); } );

		} );

	}


	// Lighting
	var light = new THREE.AmbientLight( 0x404040 );    // Flat lighting
	light.intensity = 10.5;
	scene.add( light );


	// Orbit controls
	var orbitControls = new THREE.OrbitControls( camera, renderer.domElement );
	orbitControls.minDistance = 2;
	orbitControls.maxDistance = 30;
	orbitControls.enablePan = false;
	orbitControls.zoomSpeed = 1.0;
	orbitControls.rotateSpeed = 1.0;
	orbitControls.minPolarAngle = 0;
	orbitControls.maxPolarAngle = Math.PI;


	// Drag controls
	var draggable = [];

	var dragControls = new THREE.DragControls( draggable, false, camera, renderer.domElement );

	renderer.domElement.addEventListener( 'mousemove', onMouseMove );
	dragControls.addEventListener( 'dragstart', onDragStart );
	dragControls.addEventListener( 'dragend', onDragEnd );


	// DEBUG
	var axesHelper = new THREE.AxesHelper( 10 );
	scene.add( axesHelper );


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
	// Defaults and config
	// ----------------------------------------------------------------

	var DEFAULT_STARTING_FEN = "12bc rnnr/pbbp/pqkp/pppp/4/4/4/4/4/4/PBBP/RNNR/4/4/PPPP/PQKP w KQkq - 0 1";


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

	function getObjectByPos( obj, pos ) {

		if ( obj.hasOwnProperty( 'pos' ) && obj.pos.f === pos.f &&
											obj.pos.r === pos.r &&
			 								obj.pos.l === pos.l ) {

			return obj

		}

		for ( let i = 0; i < obj.children.length; i++ ) {

			let child = obj.children[ i ];
			let object = getObjectByPos( child, pos );

			if ( object !== undefined ) {

				return object;

			}

		}

		return undefined;

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
	var offset = new THREE.Vector3( 4.5, 4, 2.5 );
	var boardMod = await loadModel( '../assets/board/boards.glb', offset );
	board.add( boardMod );
	var standMod = await loadModel( '../assets/board/stand.glb', offset );
	board.add( standMod );

	//var boardGeo = new THREE.BoxGeometry();
	//boardGeo.translate( 0, -0.5, 0 );    // Set origin at top
	//var boardMat = new THREE.MeshBasicMaterial( { color: 0x92b4ce } );

	//var boardMod = new THREE.Mesh( boardGeo, boardMat );
	//boardMod.position.set( 4.5, 4, 2.5 );

	//board.add( boardMod );

	// ----------------------------------------------------------------
	// Squares
	// ----------------------------------------------------------------

	var squares = [];
	var squareIndicators = [];


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


	// Square object
	var Square = function( name, pos ) {

		// Object3D constructor
		THREE.Object3D.apply( this );

		// Properties
		this.type = 'square';
		this.name = name;
		this.pos = pos;

		squares.push( this );

		// Position
		var vec = posToVector3( pos );
		this.position.set( vec.x, vec.y, vec.z );

		// Active/inactive
		this.active = false;    // TODO: Make private somehow

		this.activate = function() {

			this.active = true;

			// Add to squares array if it doesn't exist yet
			if ( squares.indexOf( this ) === -1 ) {

				squares.push( this );

			}

		}

		this.deactivate = function() {

			this.active = false;

			// Remove from squares array if it exists
			if ( squares.indexOf( this ) !== -1 ) {

				squares.splice( squares.indexOf( this ), 1 );

			}

		}

		// Square Indicator
		var mat = squIndMat.clone();
		var ind = new THREE.Mesh( squIndGeo, mat );
		ind.rotateX( - Math.PI / 2 );    // Rotate upright
		ind.material.visible = false;
		ind.name = "ind: " + this.name;
		this.add( ind );
		squareIndicators.push( ind );

		// Piece
		var piece = null;

		this.getPiece = function() { return piece }
		this.setPiece = function( pie ) {

			if ( pie !== null ) {

				// Remove old piece
				this.setPiece( null );
				scene.remove( piece );

				// Add new piece
				piece = pie;
				this.add( piece );

				piece.position.set( 0, 0, 0 );    // Move to relative origin

				// Add to pieces array if it doesn't exist yet
				if ( pieces.indexOf( piece ) === -1 ) {

					pieces.push( piece );

					// Update draggable
					// TODO: Better way to update draggable?
					draggable.push( piece );

				}

			} else {

				this.remove( piece );

				// Remove from pieces array if it exists
				if ( pieces.indexOf( piece ) !== -1 ) {

					pieces.splice( pieces.indexOf( piece ), 1 );

					// Update draggable
					// TODO: Better way to update draggable?
					draggable.splice( draggable.indexOf( piece ), 1 );

				}

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

		this.unhighlight = function() {

			ind.material.visible = false;

			// TODO: Unhighlight piece

		}

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

	}


	// ----------------------------------------------------------------
	// Towers
	// ----------------------------------------------------------------

	var towers = [];
	var towerIndicators = [];


	// Defaults
	var DEFAULT_TOW_IND_COLOR = 0x9cc5d6;
	var DEFAULT_TOW_IND_OPACITY = 0.75;


	// Tower model
	var towMod = await loadModel( '../assets/board/towers/tower.glb' );

	//var towGeo = new THREE.BoxGeometry( 0.25, 2, 0.25 );
	//towGeo.translate( 0, 1, 0 );    // Set origin at bottom
	//var towMat = new THREE.MeshBasicMaterial( { color: 0xff000 } );


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
		this.pos = pos;    // Integer position (e.g. 1 for T1)

		// Position
		var vec = posToVector3( TOWER_POSITIONS[ pos -1 ] );
		this.position.set( vec.x, vec.y, vec.z );

		// Active/inactive
		this.active = false;    // TODO: Make private somehow

		this.activate = function() {

			this.active = true;
			model.visible = true;

			// Add to towers array if it doesn't exist yet
			if ( towers.indexOf( this ) === -1 ) {

				towers.push( this );

				// Update draggable
				// TODO: Better way to update draggable?
				draggable.push( model );

			}

			// Activate squares
			for ( let i = 0; i < this.squares.length; i++ ) {

				this.squares[ i ].activate();

			}

		}

		this.deactivate = function() {

			this.active = false;
			model.visible = false;

			// Reset position to relativ origin
			model.position.set( 0, 0, 0 );

			// Remove from towers array if it exists
			if ( towers.indexOf( this ) !== -1 ) {

				towers.splice( towers.indexOf( this ), 1 );

				// Update draggable
				// TODO: Better way to update draggable?
				draggable.splice( draggable.indexOf( model ), 1 );

			}

			// Activate squares
			for ( let i = 0; i < this.squares.length; i++ ) {

				this.squares[ i ].deactivate();

			}

		}

		// Tower model
		var model = towMod.clone();
		this.add( model );

		// Tower Indicator
		var mat = towIndMat.clone();
		var ind = new THREE.Mesh( towIndGeo, mat );
		ind.material.visible = false;
		this.add( ind );
		towerIndicators.push( ind );

		// Squares
		this.squares = squares;

		for ( let squ = 0; squ < this.squares.length; squ++ ) {

			model.attach( this.squares[ squ ] );

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
		tower.activate();

		board.add( tower );

	}


	// ----------------------------------------------------------------
	// Pieces
	// ----------------------------------------------------------------

	var pieces = [];


	// TODO: Add real piece models
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

	}

	Piece.prototype = Object.create( THREE.Mesh.prototype );
	Piece.prototype.constructor = Piece;


	// ----------------------------------------------------------------
	// Moving
	// ----------------------------------------------------------------

	function movePiece( source, target ) {

		// Convert pieces to squares
		if ( source.type === 'piece' ) { source = source.parent; }
		if ( target.type === 'piece' ) { target = target.parent; }

		// Move piece while overwriting target piece
		if ( source !== target ) {

			let piece = source.getPiece()
			source.setPiece( null );
			target.setPiece( piece );

		} else {

			// Move to self (resets relative position)
			target.setPiece( source.getPiece() );

		}

	}

	function moveTower( source, target ) {

		// Convert towerModels to towers
		if ( source.type === 'Mesh' ) { source = source.parent; }
		if ( target.type === 'Mesh' ) { target = target.parent; }

		// Update tower positions
		source.deactivate();
		target.activate();

		// Move pieces
		for ( let i = 0; i < source.squares.length; i++ ) {

			movePiece( source.squares[ i ], target.squares[ i ] );

		}

	}

	function move( source, target ) {

		// Convert string-names to objects (squares, pieces, towers)
		if ( typeof( source ) === 'string' ) {

			source = board.getObjectByName( source );

		}

		if ( typeof( target ) === 'string' ) {

			target = board.getObjectByName( target );

		}

		// Move tower or piece
		if ( ( source.type === 'square' || source.type === 'piece' ) &&
			 ( target.type === 'square' || target.type === 'piece' ) ) {

			movePiece( source, target );

		} else {

			moveTower( source, target );

		}

	}


	// ----------------------------------------------------------------
	// Movement callbacks
	// ----------------------------------------------------------------

	var selected = null, target = null;
	var snap_pos = new THREE.Vector3();

	var mouse = new THREE.Vector2();
	var raycaster = new THREE.Raycaster();

	function onMouseMove( event ) {

		event.preventDefault();

		// Get mouse position
		var rect = renderer.domElement.getBoundingClientRect();
		mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

		// Hightlight hovered squares
		if ( selected !== null ) {

			let selectable = [];
			if ( selected.type === 'piece' ) { selectable = squares; }
			if ( selected.parent.type === 'tower' ) { selectable = towerIndicators; }

			raycaster.setFromCamera( mouse, camera );
			let intersects = raycaster.intersectObjects( selectable, true );

			// At least one object apart from the selected one has been hit
			if ( intersects.length > 0 ) {

				for ( let i = 0; i < intersects.length; i++ ) {

					let intObj = intersects[ i ].object;

					// Ignore selected object to prevent moving to itself
					if ( intObj !== selected && intObj.parent !== selected ) {

						// If target changed
						if ( target !== intObj.parent ) {

							if ( target !== null ) { target.unhighlight(); }
							target = intObj.parent;
							target.highlight();

						}

						break;

					} else {

						// TODO: Better way to stop squares from staying highlighted?
						if ( target !== null ) { target.unhighlight(); }
						target = null;

					}

				}

			} else {

				if ( target !== null ) { target.unhighlight(); }
				target = null;

			}

		}

	}


	function onDragStart( event ) {

		orbitControls.enabled = false;

		if ( event.object !== undefined ) {

			// Get selected object
			selected = event.object;

			// DEBUG
			console.log( "Selected: ");
			console.log( selected );

			// Store position for snapback
			snap_pos = selected.position.clone();

		}

	}


	function onDragEnd( event ) {

		orbitControls.enabled = true;

		if ( selected !== null ) {

			if ( target !== null ) {

				move( selected, target );
				target.unhighlight();

			} else {

				// Snapback piece
				selected.position.set( snap_pos.x , snap_pos.y, snap_pos.z );

			}

			selected = null;
			target = null;

		}

	}


	// ----------------------------------------------------------------
	// Position loading
	// ----------------------------------------------------------------

	function loadFen( fen ) {

		// Reset board
		var length = towers.length;    // Needed, as loop removes elements
		for ( let i = 0; i < length; i++ ) { towers[ 0 ].deactivate(); }

		length = pieces.length;    // Needed, as loop removes elements
		for ( let i = 0; i < length; i++ ) {

			pieces[ 0 ].parent.setPiece( null );    // Remove piece from square

		}


		var fields = fen.split( ' ' );


		// Get tower positions
		var towPos = fields[ 0 ].split( '' );

		// Activate towers
		for ( let i = 0; i < towPos.length; i++ ) {

			// Convert 12-base positions to integer
			towPos[ i ] = parseInt( towPos[ i ], 13 );

			let tower = board.getObjectByProperty( 'pos', towPos[ i ] );
			tower.activate();

		}


		// Get piece positions

		// Remove slashes
		var position = fields[ 1 ].split( '/' );
		position = position.join( '' );

		// Expand empty squares
		for ( let i = 0; i < position.length; i++ ) {

			if ( '0123456789'.indexOf( position[ i ] ) !== -1 ) { // Is number

				// Replace number with number of spaces (3 ->    )
				let num = parseInt( position[ i ], 10 );
				let str = new Array( num + 1 ).join( ' ' );
				position = position.replace( position[ i ], str );

			}

		}

		// Place pieces
		var i = 0;

		for ( let l = 5; l >= 0; l-- ) {

			for ( let r = 9; r >= 0; r-- ) {

				for ( let f = 0; f <= 5; f++ ) {

					let piece = position[ i ];
					let pos = new Pos( f, r, l );
					let square = getObjectByPos( board, pos );

					// If a square exists and it is not on a inactive tower
					if ( square !== undefined  && square.parent.parent.active !== false ) {

						// If the square is not supposed to be empty
						if ( piece !== ' ' ) {

							// Add piece to square
							square.setPiece( new Piece( piece ) );

						}

						i++;

					}

				}

			}

		}

	}


	function generateFen() {

		// Get tower positions
		var towPos = '';

		for ( let i = 0; i < towers.length; i++ ) {

			if ( towers[i].active ) {

				// Convert integer to 12-base position
				let pos = towers[ i ].pos.toString( 13 );

				// Add to tower positions
				towPos += pos;

			}

		}


		// Get piece positions
		var piePos = '';

		for ( let l = 5; l >= 0; l-- ) {

			for ( let r = 9; r >= 0; r-- ) {

				let emptySqu = 0;

				for ( let f = 0; f <= 5; f++ ) {

					let pos = new Pos( f, r, l );
					let square = getObjectByPos( board, pos );

					// If a square exists and it is not on a inactive tower
					if ( square !== undefined  && square.parent.parent.active !== false ) {

						let piece = square.getPiece();

						// If the square is not empty
						if ( piece ) {

							// Add piece or empty squares to piece positions
							if ( emptySqu > 0) { piePos += emptySqu; }
							piePos += piece.name;
							emptySqu = 0;

						} else {

							emptySqu++;

						}

					}

				}

				if ( emptySqu > 0) { piePos += emptySqu; }

				// Only add row separator if row is now empty or last row
				if ( !( piePos.endsWith('/') ) && !( l === 0 && r <= 1 ) ) {

					piePos += '/';

				}

			}

		}

		// Compose fen string
		var fen = towPos + ' ' + piePos;

		return fen;

	}


	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// Public functions
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	this.move = function( source, target ) {

		move( source, target );

	}

	// DEBUG
	loadFen( DEFAULT_STARTING_FEN );
	console.log( generateFen() );

}
