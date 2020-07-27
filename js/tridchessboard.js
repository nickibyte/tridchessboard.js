// tridchessboard.js
// https://github.com/nickibyte/tridchessboard.js
//
// Copyright (c) 2020 nickibyte <https://github.com/nickibyte>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.


// Imports (will be handled by build script)
//
// import './three.js/build/three.min.js'
// import './three.js/examples/js/controls/OrbitControls.js'
// import './three.js/examples/js/controls/DragControls.js'
// import './three.js/examples/js/loaders/GLTFLoader.js'


var Tridchessboard = function( canvasId, config ) {

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// Defaults and config
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	// Defaults
	/*var DEFAULT_CONFIG = {

		draggable: false,
		dropOffBoard: 'snapback',
		position: null,
		onChange: null,
		onDragStart: null,
		onDragMove: null,
		onDrop: null,
		//onMouseoutSquare,
		//onMouseoverSquare,
		onMoveEnd: null,
		onSnapbackEnd: null,
		onSnapEnd: null,
		orientation,
		showNotation: true,
		sparePieces: false,
		showErrors,
		pieceTheme: '',
		boardTheme: '',
		//appearSpeed: 200,
		//moveSpeed: 200,
		//snapbackSpeed: 50,
		//snapSpeed: 25,
		//trashSpeed: 100,

	};*/


	// Orientation (camera position)
	var ORIENTATION_WHITE = new THREE.Vector3( -12, 10, 0 );
	var ORIENTATION_BLACK = new THREE.Vector3( 5, 15, 0 );
	var DEFAULT_ORIENTATION = new THREE.Vector3( -10, 7, 10 );
	var currentOrientation = null;

	// PieceTheme
	var PIECE_THEME = {

		wP: '../assets/pieces/wP.glb',
		wN: '../assets/pieces/wN.glb',
		wB: '../assets/pieces/wB.glb',
		wR: '../assets/pieces/wR.glb',
		wQ: '../assets/pieces/wQ.glb',
		wK: '../assets/pieces/wK.glb',
		bP: '../assets/pieces/bP.glb',
		bN: '../assets/pieces/bN.glb',
		bB: '../assets/pieces/bB.glb',
		bR: '../assets/pieces/bR.glb',
		bQ: '../assets/pieces/bQ.glb',
		bK: '../assets/pieces/bK.glb'

	};

	// TowerTheme
	var TOWER_THEME = '../assets/board/towers/tower.glb';

	// BoardTheme
	var BOARD_THEME = '../assets/board/boards.glb';
	var STAND_THEME = '../assets/board/stand.glb';


	// Load config and apply defaults
	if ( config.draggable !== true ) { config.draggable = false }
	if ( config.dropOffBoard !== 'trash' ) { config.dropOffBoard = 'snapback' }
	if ( config.sparePieces !== true ) { config.sparePieces = false }

	// TODO: Validate themes
	if ( !config.hasOwnProperty( 'pieceTheme' ) ) { config.pieceTheme = PIECE_THEME; }
	if ( !config.hasOwnProperty( 'towerTheme' ) ) { config.towerTheme = TOWER_THEME; }
	if ( !config.hasOwnProperty( 'boardTheme' ) ) { config.boardTheme = BOARD_THEME; }
	if ( !config.hasOwnProperty( 'standTheme' ) ) { config.standTheme = STAND_THEME; }

	if ( config.hasOwnProperty( 'orientation' ) ) {

		if ( typeof ( config.orientation ) === 'string' &&
			 config.orientation.toLowerCase() === 'white' ) {

			config.orientation = ORIENTATION_WHITE;
			currentOrientation = 'white';

		} else if ( typeof ( config.orientation ) === 'string' &&
					config.orientation.toLowerCase() === 'black' ) {

			config.orientation = ORIENTATION_BLACK;
			currentOrientation = 'black';

		} else if ( typeof ( config.orientation.x ) !== 'number' ||
					typeof ( config.orientation.y ) !== 'number' ||
					typeof ( config.orientation.z ) !== 'number' ) {

			config.orientation = DEFAULT_ORIENTATION;

		}

	} else { config.orientation = DEFAULT_ORIENTATION; }


	// Callback methods

	// TODO: Find way to not call this on internal moves
	function callOnChange( oldPos ) {

		if ( typeof ( config.onChange ) === 'function' ) {

			var newPos = generatePos();

			// TODO: Only call if the position was changed
			config.onChange( oldPos, newPos );

		}

	}

	function callOnDragStart( obj ) {

		if ( typeof ( config.onDragStart ) === 'function' ) {

			var source = obj.parent.name;

			// Tower or piece (for towers source and piece are the same)
			var piece = obj.parent.name;
			if ( obj.type === 'piece' ) { piece = obj.name; }

			var pos = position();

			return config.onDragStart( source, piece, pos, currentOrientation );

		}

	}

	function callOnDragMove( newObj, oldObj, obj ) {

		if ( typeof ( config.onDragMove ) === 'function' ) {

			newObj = newObj.name;
			oldObj = oldObj.name;
			var source = obj.parent.name;

			// Tower or piece (for towers source and piece are the same)
			var piece = obj.parent.name;
			if ( obj.type === 'piece' ) { piece = obj.name; }

			var pos = position();

			// Only call if the square/tower position was changed
			if ( newObj !== oldObj ) {

				config.onDragMove( newObj, oldObj, source, piece, pos, currentOrientation );

			}

		}

	}

	function callOnDrop( source, target, obj, oldPos ) {

		if ( typeof ( config.onDrop ) === 'function' ) {

			source = source.name;
			if ( target !== 'offboard' ) { target = target.name; }

			// Tower or piece (for towers source and piece are the same)
			var piece = obj.parent.name;
			if ( obj.type === 'piece' ) { piece = obj.name; }

			var newPos = position();

			return config.onDrop( source, target, piece, newPos, oldPos, currentOrientation );

		}
	}

	// TODO: Same as callOnChange, combine somehow
	function callOnMoveEnd( oldPos ) {

		if ( typeof ( config.onMoveEnd ) === 'function' ) {

			var newPos = generatePos();

			// TODO: Only call if the position was changed
			config.onMoveEnd( oldPos, newPos );

		}

	}

	function callOnSnapbackEnd( obj, source ) {

		if ( typeof ( config.onSnapbackEnd ) === 'function' ) {

			source = source.name;

			// Tower or piece (for towers source and piece are the same)
			var piece = obj.parent.name;
			if ( obj.type === 'piece' ) { piece = obj.name; }

			var pos = position();

			config.onSnapbackEnd( piece, source, pos, currentOrientation );

		}
	}

	function callOnSnapEnd( source, target ) {

		if ( typeof ( config.onSnapEnd ) === 'function' ) {

			// Convert pieces/towerModels to squares/towers
			if ( source.type === 'piece' || source.type === 'Mesh' ) { source = source.parent; }
			if ( target.type === 'piece' || target.type === 'Mesh' ) { target = target.parent; }

			// Tower or piece (for towers source and piece are the same)
			var piece = source.name;
			if ( target.type === 'square' ) { piece = target.getPiece().name; }

			source = source.name;
			target = target.name;

			config.onSnapEnd( source, target, piece );

		}

	}

	// TODO: Config - stand (toggle)
	// TODO: Config - user defined start position
	// TODO: Config - show errors
	// TODO: Config - spare pieces
	// TODO: Config - notation
	// TODO: Config - shorthands (start, fen, position)
	// TODO: Config - configurable colors (background, pieces, squares?)


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
	camera.position.set( config.orientation.x,
						 config.orientation.y,
						 config.orientation.z );


	// Renderer
	var renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( width, height );
	renderer.setClearColor( 0xcccccc, 1 );
	document.getElementById( canvasId ).appendChild( renderer.domElement );


	// GLTFLoader for model loading
	var loader = new THREE.GLTFLoader();

	// Function to handle async model loading
	function loadModel( path ) {

		return new Promise( function ( resolve, reject ) {

			loader.load( path, function ( gltf ) {

				var mesh = gltf.scene.children[ 0 ];
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

	if ( config.draggable ) {

		var dragControls = new THREE.DragControls( draggable, false, camera, renderer.domElement );

		dragControls.addEventListener( 'dragstart', onDragStart );
		dragControls.addEventListener( 'dragend', onDragEnd );

	}

	renderer.domElement.addEventListener( 'mousemove', onMouseMove );


	// DEBUG
	//var axesHelper = new THREE.AxesHelper( 10 );
	//scene.add( axesHelper );


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
	var EMPTY_BOARD_FEN = "12bc 4/4/4/4/4/4/4/4/4/4/4/4/4/4/4/4 w KQkq - 0 1";


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

	var boardMod = new THREE.Mesh();
	boardMod.position.set( offset.x, offset.y, offset.z );
	board.add( boardMod );
	loadModel( config.boardTheme ).then( function( model ) {

		boardMod.geometry = model.geometry;
		boardMod.material = model.material;

	} );

	var standMod = new THREE.Mesh();
	standMod.position.set( offset.x, offset.y, offset.z );
	board.add( standMod );
	loadModel( config.standTheme ).then( function( model ) {

		standMod.geometry = model.geometry;
		standMod.material = model.material;

	} );

	// TODO: Make toggleable
	standMod.visible = false;


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

		}

		this.unhighlight = function() {

			ind.material.visible = false;

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
	var towerObjs = [];
	var towerIndicators = [];


	// Defaults
	var DEFAULT_TOW_IND_COLOR = 0x9cc5d6;
	var DEFAULT_TOW_IND_OPACITY = 0.75;


	// Tower model
	var towMod = loadModel( config.towerTheme );
	towMod.then( function( model ) {

		for ( let i = 0; i < towerObjs.length; i++ ) {

			let tow = towerObjs[ i ];
			tow.loadModel( model );

		}

	} );


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

			// Deactivate squares
			for ( let i = 0; i < this.squares.length; i++ ) {

				this.squares[ i ].deactivate();

			}

		}

		// Tower model
		var model = new THREE.Mesh(); // Geo + mat set once model is loaded
		this.add( model );

		this.loadModel = function( mod ) {

			model.geometry = mod.geometry;
			model.material = mod.material;

		}


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
		towerObjs.push( tower );
		tower.deactivate();

		board.add( tower );

	}


	// ----------------------------------------------------------------
	// Pieces
	// ----------------------------------------------------------------

	var pieces = [];


	//var pieHeight = 1.25;

	//function pieGeo( height ) {

	//	var pieGeo = new THREE.BoxGeometry( 0.5, height, 0.5 );
	//	pieGeo.translate( 0, height / 2 + 0.01, 0 );    // Set Origin at bottom

	//	return pieGeo;

	//}

	var pieModels;

	var promises = [ loadModel( config.pieceTheme.wP ),
					 loadModel( config.pieceTheme.wN ),
					 loadModel( config.pieceTheme.wB ),
					 loadModel( config.pieceTheme.wR ),
					 loadModel( config.pieceTheme.wQ ),
					 loadModel( config.pieceTheme.wK ),
					 loadModel( config.pieceTheme.bP ),
					 loadModel( config.pieceTheme.bN ),
					 loadModel( config.pieceTheme.bB ),
					 loadModel( config.pieceTheme.bR ),
					 loadModel( config.pieceTheme.bQ ),
					 loadModel( config.pieceTheme.bK ) ];


	Promise.all( promises ).then( function( models ) {

		// Pieces: Pawn, Knight, Bishop, Rook, Queen, King
		// white and black
		pieModels = {

			wP: models[ 0 ],
			wN: models[ 1 ],
			wB: models[ 2 ],
			wR: models[ 3 ],
			wQ: models[ 4 ],
			wK: models[ 5 ],
			bP: models[ 6 ],
			bN: models[ 7 ],
			bB: models[ 8 ],
			bR: models[ 9 ],
			bQ: models[ 10 ],
			bK: models[ 11 ]

		};

		for ( let i = 0; i < pieces.length; i++ ) {

			let pie = pieces[ i ];
			pie.loadModel( pieModels[ pie.name ] );

		}

	} );


	//var pieMatWhite = new THREE.MeshBasicMaterial( { color: 0xf7f7f7 } );
	//var pieMatBlack = new THREE.MeshBasicMaterial( { color: 0x3a3a3a } );

	// Piece object
	var Piece = function( name ) {

		// Mesh constructor
		THREE.Mesh.apply( this );

		// Properties
		this.type = 'piece';
		this.name = name;

		// Piece model
		this.loadModel = function( mod ) {

			this.geometry = mod.geometry;
			this.material = mod.material;

			this.geometry.translate( 0, 0.001, 0 );    // Set Origin at bottom

		}

		if ( pieModels !== undefined ) { this.loadModel( pieModels[ name ] ); }

	}

	Piece.prototype = Object.create( THREE.Mesh.prototype );
	Piece.prototype.constructor = Piece;


	// ----------------------------------------------------------------
	// Moving
	// ----------------------------------------------------------------

	function addPiece( square, piece ) {

		square.setPiece( new Piece( piece ) );

	}

	function addTower( tower ) { tower.activate(); }

	function add( target, piece ) {

		var oldPos = generatePos();

		if ( typeof( target ) === 'string' ) {

			target = board.getObjectByName( target );

		}

		// Add tower or piece
		if ( target.type === 'square' ) {

			addPiece( target, piece );

		} else {

			addTower( target );

		}

		callOnChange( oldPos );

	}

	function removePiece( square ) {

		// Convert pieces to squares
		if ( square.type === 'piece' ) { square = square.parent; }

		square.setPiece( null );

	}

	function removeTower( tower ) {

		// Convert towerModels to towers
		if ( tower.type === 'Mesh' ) { tower = tower.parent; }

		tower.deactivate();

		// TODO: Shouldn't this be done in square.deactivate method?
		// Remove pieces
		for ( let i = 0; i < tower.squares.length; i++ ) {

			tower.squares[ i ].setPiece( null );

		}

	}

	function remove( target ) {

		var oldPos = generatePos();

		if ( typeof( target ) === 'string' ) {

			target = board.getObjectByName( target );

		}

		// remove tower or piece
		if ( target.type === 'square' || target.type === 'piece' ) {

			removePiece( target );

		} else {

			// This must be else and not else if type === 'tower'
			// Because the dragged tower is of type Mesh
			// removeTower handles this
			removeTower( target );

		}

		callOnChange( oldPos );

	}


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

		// Move pieces
		for ( let i = 0; i < source.squares.length; i++ ) {

			movePiece( source.squares[ i ], target.squares[ i ] );

		}

		// Update tower positions
		// Needs to be done after moving, as deactivating removes pieces
		source.deactivate();
		target.activate();

	}

	// TODO: Handle invalid moves (do nothing)
	function move( source, target ) {

		var oldPos = generatePos();

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

			// This must be else and not else if type === 'tower'
			// because the dragged tower is of type Mesh
			// moveTower handles this
			moveTower( source, target );

		}

		callOnMoveEnd( oldPos );
		callOnSnapEnd( source, target );
		callOnChange( oldPos );

	}


	// ----------------------------------------------------------------
	// Dragging
	// ----------------------------------------------------------------

	var selected = null, target = null, oldTar = null;
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

							if ( oldTar !== null ) {

								callOnDragMove( target, oldTar, selected );

							}
							oldTar = target;

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

			// Store position for snapback
			snap_pos = selected.position.clone();

			var onDragStart = callOnDragStart( event.object );

			if ( onDragStart === false ) {

				// Cancel Drag
				dragControls.enabled = false;
				onDragEnd();

			}

		}

	}


	function onDragEnd( event ) {

		orbitControls.enabled = true;

		if ( selected !== null ) {

			var action = 'move';

			// Save position for onDrop
			var oldPos = position();

			if ( target !== null ) { target.unhighlight(); }
			else {

				target = 'offboard';

				if( config.dropOffBoard === 'trash' ) { action = 'trash'; }
				else { action = 'snapback' }

			}

			// TODO: new Pos is always the same as oldPos because move() is called after onDrop
			var onDrop = callOnDrop( selected.parent, target, selected, oldPos );

			// Overwrite onDrop action
			if ( onDrop === 'trash' ) { action = 'trash'; }
			else if ( onDrop === 'snapback' ) { action = 'snapback'; }

			if ( action === 'trash' ) {

				// Trash piece/tower
				remove( selected );

			} else if ( action === 'snapback' ) {

				// Snapback piece/tower
				selected.position.set( snap_pos.x , snap_pos.y, snap_pos.z );

				callOnSnapbackEnd( selected, selected.parent );

			} else if ( action === 'move' ) {

				move( selected, target );

			}

			selected = null;
			target = null;

		}

	}


	// ----------------------------------------------------------------
	// Fen and position loading
	// ----------------------------------------------------------------

	function resetBoard() {

		var length = towers.length;    // Needed, as loop removes elements
		for ( let i = 0; i < length; i++ ) { towers[ 0 ].deactivate(); }

		length = pieces.length;    // Needed, as loop removes elements
		for ( let i = 0; i < length; i++ ) {

			pieces[ 0 ].parent.setPiece( null );    // Remove piece from square

		}

	}


	function loadFen( fen ) {

		var oldPos = generatePos();

		// Reset board
		resetBoard();

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

							// Convert FEN piece to piece code (wP, bQ, ...)
							if ( piece.toLowerCase() === piece ) {

								piece = 'b' + piece.toUpperCase();

							}
							else {

								piece = 'w' + piece.toUpperCase();

							}

							// Add piece to square
							square.setPiece( new Piece( piece ) );

						}

						i++;

					}

				}

			}

		}

		callOnChange( oldPos );

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

							// Convert piece code to FEN piece
							let pieCode = '';

							if ( piece.name[ 0 ] === 'b' ) {

								pieCode = piece.name[ 1 ].toLowerCase();

							} else {

								pieCode = piece.name[ 1 ].toUpperCase();

							}

							piePos += pieCode;
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


	function loadPos( pos ) {

		var oldPos = generatePos();

		// Reset board
		resetBoard();

		// Iterate over position object (e.g. a3_1: 'wP')
		for ( let prop in pos ) {

			if ( pos.hasOwnProperty( prop ) ) {

				// Get square/tower
				let obj = board.getObjectByName( prop );

				if ( obj.type === 'square' ) {

					// Add piece to square
					obj.setPiece( new Piece( pos[ prop ] ) );

				} else if ( obj.type === 'tower' && pos[ prop ] ) {

					// Activate Tower
					obj.activate();

				}

			}

		}

		callOnChange( oldPos );

	}


	function generatePos() {

		var pos = {};

		// Add towers to position object
		for ( let i = 0; i < towers.length; i++ ) {

			let tow = towers[ i ];

			if ( tow.active ) { pos[ tow.name ] = true; }

		}

		// Add squares to position object
		for ( let i = 0; i < squares.length; i++ ) {

			let squ = squares[ i ];
			let pie = squ.getPiece();

			// If square is occupied
			if ( pie !== null ) { pos[ squ.name ] = pie.name; }

		}

		return pos

	}


	function position( arg ) {

		if ( arg === undefined ) { return generatePos(); }

		else if ( typeof( arg ) === 'string' && arg.toLowerCase() === 'fen' ) {

			return generateFen();

		}

		else if ( typeof( arg ) === 'string' && arg.toLowerCase() === 'start' ) {

			loadFen( DEFAULT_STARTING_FEN );

		}

		// TODO: Check if valid position object/fen string
		else if ( typeof( arg ) === 'object' ) { loadPos( arg ); }

		else if ( typeof( arg ) === 'string' ) { loadFen( arg ); }

	}

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// API
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	// TODO: Validate position
	// Load position
	if ( config.position !== undefined ) {

		position( config.position );

	} else { loadFen( EMPTY_BOARD_FEN ); }

	// Return object with API methods
	return {


		add: function( target, piece ) { add( target, piece ); },

		remove: function( target ) { remove( target ); },

		move: function( args ) {

			// If no moves exist, do nothing
			if ( arguments.length === 0 ) { return; }

			for ( let i = 0; i < arguments.length; i++ ) {

				if ( typeof( arguments[ i ] ) !== 'string' ) { continue; }

				let mov = arguments[ i ];

				// Remove whitespace
				mov = mov.replace( /\s/g, '' );

				// Perform move
				mov = mov.split( '-' );
				move( mov[ 0 ], mov[ 1 ] );

			}

			return generatePos();

		},

		// TODO: Reset towers + remove pieces, remove towers + pieces or only remove pieces?
		clear: function() {

			loadFen( EMPTY_BOARD_FEN );
			//resetBoard();
			// foreach square in squares: setPiece(null)

		},

		position: function( arg ) { return position( arg ); },

		fen: function() { return position( 'fen' ); },

		start: function() { position( 'start' ); },

		orientation: function( arg ) {

			if ( arguments.length === 0 ) {

				// TODO: Check if currentOrientation is set and return that instead
				return { x: Number ( camera.position.x.toFixed(2) ),
						 y: Number ( camera.position.y.toFixed(2) ),
						 z: Number ( camera.position.z.toFixed(2) ) }

			}

			if ( typeof( arg ) === 'string' && arg.toLowerCase() === 'white' ) {

				camera.position.set( ORIENTATION_WHITE.x,
									 ORIENTATION_WHITE.y,
									 ORIENTATION_WHITE.z );

				camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

				currentOrientation = 'white';

			}

			if ( typeof( arg ) === 'string' && arg.toLowerCase() === 'black' ) {

				camera.position.set( ORIENTATION_BLACK.x,
									 ORIENTATION_BLACK.y,
									 ORIENTATION_BLACK.z );

				camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

				currentOrientation = 'black';

			}

			if ( typeof( arg ) === 'string' && arg.toLowerCase() === 'flip' ) {

				if ( currentOrientation == 'white' ) {

					this.orientation( 'black' );

				} else if ( currentOrientation == 'black' ) {

					this.orientation( 'white' );

				}

			}

			if ( typeof( arg ) === 'object' && ( typeof ( arg.x ) === 'number' ||
												 typeof ( arg.y ) === 'number' ||
												 typeof ( arg.z ) === 'number' ) ) {

				camera.position.set( arg.x, arg.y, arg.z );
				camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

			}
		}


	}


}
