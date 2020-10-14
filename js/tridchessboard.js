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
	// Defaults, helpers and config
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	// ----------------------------------------------------------------
	// Defaults
	// ----------------------------------------------------------------

	// For OrbitControls and Orientation Object
	var MAX_SCROLLOUT_DISTANCE = 25;

	// Orientation (camera position)
	var WHITE_ORIENTATION = { x: -12, y: 10, z: 0 };
	var BLACK_ORIENTATION = { x: 5, y: 15, z: 0 };
	var DEFAULT_ORIENTATION = { x: -10, y: 7, z: 10 };
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

	// BoardTheme
	var BOARD_THEME = {

		board: '../assets/board/board.glb',
		tower: '../assets/board/tower.glb',
		stand: '../assets/board/stand.glb'

	};


	// ----------------------------------------------------------------
	// Helpers
	// ----------------------------------------------------------------

	// Merge two JavaScript objects (shallow merge)
	// Returns new object
	// TODO: Change so that only properties are copied
	function merge() {

		var target = {};

		for ( let i = 0; i < arguments.length; i++ ) {

			let obj = arguments[ i ];

			for ( let prop in obj ) {

				if ( obj.hasOwnProperty( prop ) ) {

					target[ prop ] = obj[ prop ];

				}

			}

		}

		return target;

	}


	// Pos object: Specifies a certain square on the board
	var Pos = function( file, row, level ) {

		this.f = file;
		this.r = row;
		this.l = level;

	}


	// Squares

	var MAIN_SQUARES = {

		// Low board
		b2_1: new Pos(1,1,0), c2_1: new Pos(2,1,0), d2_1: new Pos(3,1,0), e2_1: new Pos(4,1,0),
		b3_1: new Pos(1,2,0), c3_1: new Pos(2,2,0), d3_1: new Pos(3,2,0), e3_1: new Pos(4,2,0),
		b4_1: new Pos(1,3,0), c4_1: new Pos(2,3,0), d4_1: new Pos(3,3,0), e4_1: new Pos(4,3,0),
		b5_1: new Pos(1,4,0), c5_1: new Pos(2,4,0), d5_1: new Pos(3,4,0), e5_1: new Pos(4,4,0),

		// Middle board
		b4_3: new Pos(1,3,2), c4_3: new Pos(2,3,2), d4_3: new Pos(3,3,2), e4_3: new Pos(4,3,2),
		b5_3: new Pos(1,4,2), c5_3: new Pos(2,4,2), d5_3: new Pos(3,4,2), e5_3: new Pos(4,4,2),
		b6_3: new Pos(1,5,2), c6_3: new Pos(2,5,2), d6_3: new Pos(3,5,2), e6_3: new Pos(4,5,2),
		b7_3: new Pos(1,6,2), c7_3: new Pos(2,6,2), d7_3: new Pos(3,6,2), e7_3: new Pos(4,6,2),

		// High board
		b6_5: new Pos(1,5,4), c6_5: new Pos(2,5,4), d6_5: new Pos(3,5,4), e6_5: new Pos(4,5,4),
		b7_5: new Pos(1,6,4), c7_5: new Pos(2,6,4), d7_5: new Pos(3,6,4), e7_5: new Pos(4,6,4),
		b8_5: new Pos(1,7,4), c8_5: new Pos(2,7,4), d8_5: new Pos(3,7,4), e8_5: new Pos(4,7,4),
		b9_5: new Pos(1,8,4), c9_5: new Pos(2,8,4), d9_5: new Pos(3,8,4), e9_5: new Pos(4,8,4)

	};

	var TOWER_SQUARES = {

		T1: { a1_2: new Pos(0,0,1), b1_2: new Pos(1,0,1),
			  a2_2: new Pos(0,1,1), b2_2: new Pos(1,1,1) },

		T2: { e1_2: new Pos(4,0,1), f1_2: new Pos(5,0,1),
			  e2_2: new Pos(4,1,1), f2_2: new Pos(5,1,1) },

		T3: { a5_2: new Pos(0,4,1), b5_2: new Pos(1,4,1),
			  a6_2: new Pos(0,5,1), b6_2: new Pos(1,5,1) },

		T4: { e5_2: new Pos(4,4,1), f5_2: new Pos(5,4,1),
			  e6_2: new Pos(4,5,1), f6_2: new Pos(5,5,1) },

		T5: { a3_4: new Pos(0,2,3), b3_4: new Pos(1,2,3),
			  a4_4: new Pos(0,3,3), b4_4: new Pos(1,3,3) },

		T6: { e3_4: new Pos(4,2,3), f3_4: new Pos(5,2,3),
			  e4_4: new Pos(4,3,3), f4_4: new Pos(5,3,3) },

		T7: { a7_4: new Pos(0,6,3), b7_4: new Pos(1,6,3),
			  a8_4: new Pos(0,7,3), b8_4: new Pos(1,7,3) },

		T8: { e7_4: new Pos(4,6,3), f7_4: new Pos(5,6,3),
			  e8_4: new Pos(4,7,3), f8_4: new Pos(5,7,3) },

		T9: { a5_6: new Pos(0,4,5), b5_6: new Pos(1,4,5),
			  a6_6: new Pos(0,5,5), b6_6: new Pos(1,5,5) },

		T10: { e5_6: new Pos(4,4,5), f5_6: new Pos(5,4,5),
			   e6_6: new Pos(4,5,5), f6_6: new Pos(5,5,5) },

		T11: { a9_6: new Pos(0,8,5), b9_6: new Pos(1,8,5),
			   a10_6: new Pos(0,9,5), b10_6: new Pos(1,9,5) },

		T12: { e9_6: new Pos(4,8,5), f9_6: new Pos(5,8,5),
			   e10_6: new Pos(4,9,5), f10_6: new Pos(5,9,5) }

	};


	// Validation

	function isValidSquare( squ ) {

		if ( typeof( squ ) !== 'string' ) { return false; }

		// Check for valid square name (e.g. a3_1)
		// file (a-f), row (1-10) and level (1-6)
		let reg = new RegExp( '^[a-f](?:[1-9]|10)_[1-6]$' );
		if ( !reg.test( squ ) ) { return false; }

		return true;

	}

	function isValidTower( tow ) {

		if ( typeof( tow ) !== 'string' ) { return false; }

		// Check for valid tower name (T1, T2, ..., T12)
		let reg = new RegExp( '^T(?:[1-9]|1[012])$' );
		if ( !reg.test( tow ) ) { return false; }

		return true;

	}

	function isValidPieceCode( pie ) {

		if ( typeof( pie ) !== 'string' ) { return false; }

		// Check for valid piece code (e.g. wP, bK, wQ)
		let reg = new RegExp( '^[wb][PNBRQK]$' );
		if ( !reg.test( pie ) ) { return false; }

		return true;

	}

	function isValidPos( pos ) {

		if ( typeof( pos ) !== 'object' ) { return false; }

		var squares = merge( MAIN_SQUARES );

		// Get towers from position object
		for ( let tow in TOWER_SQUARES ) {

			if ( pos.hasOwnProperty( tow ) && pos[ tow ] === true ) {

				// Add tower squares to main squares
				squares = merge( squares, TOWER_SQUARES[ tow ] );

			}

		}

		// Iterate over position object (e.g. a3_1: 'wP')
		for ( let prop in pos ) {

			if ( pos.hasOwnProperty( prop ) ) {

				if ( TOWER_SQUARES.hasOwnProperty( prop ) ) {

					// If valid tower
					// Check tower value (true/false)
					if ( typeof( pos[ prop ] ) !== 'boolean' ) { return false; }

				} else if ( squares.hasOwnProperty( prop ) ) {

					// If square is valid and exists
					// Check piece code
					if ( !isValidPieceCode( pos[ prop ] ) ) { return false; }

				} else { return false; }

			}

		}

		return true;

	}

	function expandPiecePosition( piePos, towers ) {

		// Expand empty squares
		piePos = piePos.replace( /4/g, '1111' ).replace( /3/g, '111' ).replace( /2/g, '11' );

		// Expand non existing (tower) squares
		var levels = piePos.split( '|' );

		for ( let l = 0; l < levels.length; l++ ) {

			let rows = levels[ l ].split( '/' );

			for ( let r = 0; r < rows.length; r++ ) {

				if ( rows[ r ].length === 2 ) {

					// If there is a tower missing on the row

					// Find out which tower exists
					// TODO: Is there a better way to do this?
					let tow = 12 - (2 * l + r);

					if ( tow % 2 === 0 ) {

						if ( towers.indexOf( tow ) !== -1 ) {

							// If it is the right (even) tower

							// Add non existing squares to the left
							rows[ r ] = '00' + rows[ r ];

						} else {

							// If it is the left (odd) tower

							// Add non existing squares to the right
							rows[ r ] = rows[ r ] + '00';

						}

					} else {

						if ( towers.indexOf( tow ) !== -1 ) {

							// If it is the left (odd) tower

							// Add non existing squares to the right
							rows[ r ] = rows[ r ] + '00';

						} else {

							// If it is the right (even) tower

							// Add non existing squares to the left
							rows[ r ] = '00' + rows[ r ];

						}


					}

				}

			}

			levels[ l ] = rows.join( '/' );

		}

		piePos = levels.join( '|' );

		return piePos;

	}

	// TODO: Handle empty tower portion of fen string
	// TODO: Remove DEBUG code
	function isValidFen( fen ) {

		if ( typeof( fen ) !== 'string' ) { return false; }

		// Split fen into towers and piece positions
		fen = fen.split( ' ' );

		// Check tower positions

		// Check if valid towers (hex 1-c) and not more than 12 towers
		let reg = new RegExp( '^[1-9a-c]{0,12}$' );
		if ( !reg.test( fen[ 0 ] ) ) {

			//DEBUG
			console.log("ERROR: Check if valid towers (hex 1-c) and not more than 12 towers");

			return false; }

		var towPos = fen[ 0 ].split( '' );

		for ( let i = 0; i < towPos.length; i++ ) {

			// Check for duplicate towers
			if ( towPos.indexOf( towPos[ i ] ) !== towPos.lastIndexOf( towPos[ i ] ) ) {

				//DEBUG
				console.log("ERROR: Check for duplicate towers");

				return false;

			}

			// Convert 12-base positions to integer (for later piePos expansion)
			towPos[ i ] = parseInt( towPos[ i ], 13 );

		}

		// Check piece positions
		var piePos = fen[ 1 ];

		// Expand piece positions (add empty/non existing squares)
		piePos = expandPiecePosition( piePos, towPos );

		//DEBUG
		console.log("Expanded piePos: " + piePos);

		// Check: 6 levels separated by |
		var levels = piePos.split( '|' );
		if ( levels.length !== 6 ) {

			//DEBUG
			console.log("ERROR: Check 6 levels separated by |");

			return false; }

		for ( let l = 0; l < levels.length; l++ ) {

			// Check: 4 rows per level seperated by /
			let rows = levels[ l ].split( '/' );
			if ( rows.length !== 4 ) {

				//DEBUG
				console.log("ERROR: Check 4 rows separated by /");

				return false; }

			for ( let r = 0; r < rows.length; r++ ) {

				if ( rows[ r ] !== '' ) {

					if ( l % 2 === 0 ) {

						// If on a tower level

						// Find out which towers (right/left) COULD be on the row
						let towR = 12 - (2 * l + r);
						let towL = towR;
						if ( towR % 2 === 0 ) { towL--; } else { towR++; }

						// Find out which towers ARE on the row
						let rightExists = ( towPos.indexOf( towR ) !== -1 );
						let leftExists = ( towPos.indexOf( towL ) !== -1 );

						// DEBUG
						console.log("Towers: " + towPos.toString() );
						console.log("Towers that could be on row: " + towR + ", " + towL);
						console.log("Towers that are on row: " + rightExists + ", " + leftExists);

						// Find out which towers SHOULD BE on the row
						// And check: valid pieces/squares and 4/2 squares per row
						let right = new RegExp( '^00[pbnrqkPBNRQK1]{2}$' );
						let left = new RegExp( '^[pbnrqkPBNRQK1]{2}00$' );
						let both = new RegExp( '^[pbnrqkPBNRQK1]{4}$' );

						if ( right.test( rows[ r ] ) ) {

							// Only the right tower should exists
							if ( !rightExists || leftExists ) {

								//DEBUG
								console.log("ERROR: Check only right tower should exist");

								return false; }

						} else if ( left.test( rows[ r ] ) ) {

							// Only the left tower should exists
							if ( !leftExists || rightExists ) {

								//DEBUG
								console.log("ERROR: Check only left tower should exist");

								return false; }

						} else if ( both.test( rows[ r ] ) ) {

							// Both towers should exist
							if ( !rightExists || !leftExists ) {

								//DEBUG
								console.log("ERROR: Check both towers should exist");

								return false; }

						} else {

							//DEBUG
							console.log("ERROR: Invalid pieces in tower level");
							console.log( rows [ r ].toString() );

							return false; }

					} else {

						// If on a main level

						// Check: valid pieces/squares and 4 squares per row
						let reg = new RegExp( '^[pbnrqkPBNRQK1]{4}$' );
						if ( !reg.test( rows[ r ] ) ) {

							//DEBUG
							console.log("ERROR: Invalid pieces in main level");

							return false; }

					}

				}

			}

		}

		return true;

	}

	function isValidOrientation( orientation ) {

		if ( typeof( orientation ) !== 'object' ) { return false; }

		var props = [ 'x', 'y', 'z' ];

		for ( let i = 0; i < props.length; i++ ) {

			let prop = props[ i ];

			// Check: x, y and z exist and is number
			if ( !orientation.hasOwnProperty( prop ) ) { return false; }
			if ( typeof( orientation[ prop ] ) !== 'number' ) { return false; }

		}

		return true;

	}

	function isValidPieceTheme( pieceTheme ) { }

	function isValidBoardTheme( boardTheme ) { }

	function isValidMove( move ) {

		if ( typeof( move ) !== 'string' ) { return false; }

		// Check valid number of squares/towers
		var squares = move.split( '-' );
		if ( squares.length !== 2 ) { return false; }

		// Check valid square/tower names + combinations (squ-squ or tow-tow)
		if ( isValidSquare( squares[ 0 ] ) ) {

			if ( !isValidSquare( squares[ 1 ] ) ) { return false; }

		} else if ( isValidTower( squares[ 0 ] )) {

			if ( !isValidTower( squares[ 1 ] ) ) { return false; }

		} else { return false; }

		return true;

	}


	// FEN and Position Object conversion

	// TODO: Handle empty tower portion of fen string
	// TODO: Remove DEBUG code
	function objToFen( pos ) {

		if( !isValidPos( pos ) ) { return false; }

		// FEN piece positions with square names
		var piePos = 'a10_6b10_6e10_6f10_6/a9_6b9_6e9_6f9_6/a6_6b6_6e6_6f6_6/a5_6b5_6e5_6f5_6|' +
					 'b9_5c9_5d9_5e9_5/b8_5c8_5d8_5e8_5/b7_5c7_5d7_5e7_5/b6_5c6_5d6_5e6_5|' +
					 'a8_4b8_4e8_4f8_4/a7_4b7_4e7_4f7_4/a4_4b4_4e4_4f4_4/a3_4b3_4e3_4f3_4|' +
					 'b7_3c7_3d7_3e7_3/b6_3c6_3d6_3e6_3/b5_3c5_3d5_3e5_3/b4_3c4_3d4_3e4_3|' +
					 'a6_2b6_2e6_2f6_2/a5_2b5_2e5_2f5_2/a2_2b2_2e2_2f2_2/a1_2b1_2e1_2f1_2|' +
					 'b5_1c5_1d5_1e5_1/b4_1c4_1d4_1e4_1/b3_1c3_1d3_1e3_1/b2_1c2_1d2_1e2_1';

		// Generate tower positions
		var towPos = '';

		for ( let i = 1; i <= 12; i++ ) {

			// Tower name
			let tow = 'T' + i;

			// DEBUG
			console.log( "Checking tower " + tow );

			if ( pos.hasOwnProperty( tow ) && pos[ tow ] === true ) {

				// If tower exists

				// Convert tower number to 12-base and add to tower positions
				let num = i.toString( 13 );
				towPos += num;

				// DEBUG
				console.log( "Adding " + num + " to towPos: " + towPos );

			} else {

				// If tower doesn't exist

				// Remove tower squares from piece positions
				for ( let squ in TOWER_SQUARES[ tow ] ) {

					piePos = piePos.replace( squ, '')

				}

			}

		}

		// Generate piece positions
		for ( let squ in pos ) {

			// DEBUG
			console.log( "Checking square " + squ );

			if ( pos.hasOwnProperty( squ ) && squ[ 0 ] !== 'T' ) {

				// If square is occupied and it is not a tower

				// Convert piece code to FEN piece
				let pieCode = pos[ squ ];

				if ( pieCode[ 0 ] === 'b' ) {

					pieCode = pieCode[ 1 ].toLowerCase();

				} else {

					pieCode = pieCode[ 1 ].toUpperCase();

				}

				// Add piece to piece positions
				piePos = piePos.replace( squ, pieCode );

				// DEBUG
				console.log( "Square occupied. Adding " + pieCode + " to piePos: " + piePos );

			}

		}

		// Add empty squares to piece positions
		piePos = piePos.replace( /[a-f](?:[1-9]|10)_[1-6]/g, '1' );

		// Compress empty squares in piece positions
		piePos = piePos.replace( /1111/g, '4' ).replace( /111/g, '3' ).replace( /11/g, '2' );

		// Compose and return FEN string
		return towPos + ' ' + piePos;

	}

	// TODO: Handle empty tower portion of fen string
	// TODO: Remove DEBUG code
	function fenToObj( fen ) {

		if( !isValidFen( fen ) ) { return false; }

		var pos = {};

		// Split fen into towers and piece positions
		fen = fen.split( ' ' );

		// Get towers from fen
		var towPos = fen[ 0 ].split( '' );

		for ( let i = 0; i < towPos.length; i++ ) {

			// DEBUG
			console.log( "Checking tower " + towPos[ i ] );

			// Convert 12-base positions to integer
			towPos[ i ] = parseInt( towPos[ i ], 13 );

			// Tower name
			let tow = 'T' + towPos[ i ];

			// Add tower to pos
 			pos[ tow ] = true;

			// DEBUG
			console.log( "Adding " + tow + " to pos." );

		}

		// Get piece positions from fen
		var piePos = fen[ 1 ];

		// Expand piece positions (add empty/non existing squares)
		piePos = expandPiecePosition( piePos, towPos );

		// DEBUG
		console.log( "Expanded piece position: " + piePos );

		var levels = piePos.split( '|' );

		for ( let l = 0; l < levels.length; l++ ) {

			let rows = levels[ l ].split( '/' );

			for ( let r = 0; r < rows.length; r++ ) {

				let files = rows[ r ].split( '' );

				for ( let f = 0; f < files.length; f++ ) {

					let piece = files[ f ];

					// DEBUG
					console.log( "Checking square: " + piece );

					if ( piece !== '1' && piece !== '0' ) {

						// If square is not empty and exists

						// Convert FEN piece to piece code (wP, bQ, ...)
						if ( piece.toLowerCase() === piece ) {

							piece = 'b' + piece.toUpperCase();

						}
						else {

							piece = 'w' + piece.toUpperCase();

						}

						// DEBUG
						console.log( "Converted FEN piece to " + piece );

						// Compose square name
						let file = [ 'b', 'c', 'd', 'e' ][ f ];
						let row = 10 - l - r;
						let level = 6 - l;

						if ( l % 2 == 0 ) {

							// If it is a tower level

							file = [ 'a', 'b', 'e', 'f' ][ f ];
							row = [ 10 - l, 9 - l , 6 - l , 5 - l ][ r ];

						}

						let squ = file + row + '_' + level;

						// Add square + piece to pos
						pos[ squ ] = piece;

						// DEBUG
						console.log( "Adding " + squ + " to pos: " );

					}

				}

			}

		}

		return pos;

	}


	// ----------------------------------------------------------------
	// Config
	// ----------------------------------------------------------------

	// Load config and apply defaults

	// TODO: DeepCopy config object

	if ( config.draggable !== true ) { config.draggable = false; }
	if ( config.turnable !== true ) { config.turnable = false; }
	if ( config.dropOffBoard !== 'trash' ) { config.dropOffBoard = 'snapback'; }
	if ( config.sparePieces !== true ) { config.sparePieces = false; }
	if ( config.stand !== false ) { config.stand = true; }


	// TODO: Validate themes
	// pieceTheme
	if ( config.hasOwnProperty( 'pieceTheme' ) ) {

		if ( typeof ( config.pieceTheme ) === 'string' ) {

			// TODO: This can probably be done more efficently
			// Create object from string
			config.pieceTheme = {

				wP: config.pieceTheme.replace( '{piece}', 'wP' ),
				wN: config.pieceTheme.replace( '{piece}', 'wN' ),
				wB: config.pieceTheme.replace( '{piece}', 'wB' ),
				wR: config.pieceTheme.replace( '{piece}', 'wR' ),
				wQ: config.pieceTheme.replace( '{piece}', 'wQ' ),
				wK: config.pieceTheme.replace( '{piece}', 'wK' ),
				bP: config.pieceTheme.replace( '{piece}', 'bP' ),
				bN: config.pieceTheme.replace( '{piece}', 'bN' ),
				bB: config.pieceTheme.replace( '{piece}', 'bB' ),
				bR: config.pieceTheme.replace( '{piece}', 'bR' ),
				bQ: config.pieceTheme.replace( '{piece}', 'bQ' ),
				bK: config.pieceTheme.replace( '{piece}', 'bK' )

			};

		} else if ( typeof ( config.pieceTheme ) === 'function' ) {

			// TODO: This can probably be done more efficently
			// Create object from function
			config.pieceTheme = {

				wP: config.pieceTheme( 'wP' ),
				wN: config.pieceTheme( 'wN' ),
				wB: config.pieceTheme( 'wB' ),
				wR: config.pieceTheme( 'wR' ),
				wQ: config.pieceTheme( 'wQ' ),
				wK: config.pieceTheme( 'wK' ),
				bP: config.pieceTheme( 'bP' ),
				bN: config.pieceTheme( 'bN' ),
				bB: config.pieceTheme( 'bB' ),
				bR: config.pieceTheme( 'bR' ),
				bQ: config.pieceTheme( 'bQ' ),
				bK: config.pieceTheme( 'bK' )

			};

		}

	} else { config.pieceTheme = PIECE_THEME; }


	// TODO: Validate themes
	// boardTheme
	if ( config.hasOwnProperty( 'boardTheme' ) ) {

		if ( typeof ( config.boardTheme ) === 'string' ) {

			// TODO: This can probably be done more efficently
			// Create object from string
			config.boardTheme = {

				board: config.boardTheme.replace( '{part}', 'board' ),
				tower: config.boardTheme.replace( '{part}', 'tower' ),
				stand: config.boardTheme.replace( '{part}', 'stand' )

			};

		} else if ( typeof ( config.boardTheme ) === 'function' ) {

			// TODO: This can probably be done more efficently
			// Create object from function
			config.boardTheme = {

				board: config.boardTheme( 'board' ),
				tower: config.boardTheme( 'tower' ),
				stand: config.boardTheme( 'stand' )

			};

		}

	} else { config.boardTheme = BOARD_THEME; }


	// whiteOrientation
	if ( config.hasOwnProperty( 'whiteOrientation' ) &&
		 isValidOrientation( config.whiteOrientation ) ) {

		WHITE_ORIENTATION = config.whiteOrientation;

	}

	// blackOrientation
	if ( config.hasOwnProperty( 'blackOrientation' ) &&
		 isValidOrientation( config.blackOrientation ) ) {

		BLACK_ORIENTATION = config.blackOrientation;

	}

	// orientation
	if ( config.hasOwnProperty( 'orientation' ) ) {

		if ( typeof ( config.orientation ) === 'string' &&
			 config.orientation.toLowerCase() === 'white' ) {

			config.orientation = WHITE_ORIENTATION;
			currentOrientation = 'white';

		} else if ( typeof ( config.orientation ) === 'string' &&
					config.orientation.toLowerCase() === 'black' ) {

			config.orientation = BLACK_ORIENTATION;
			currentOrientation = 'black';

		} else if ( !isValidOrientation( config.orientation ) ) {

			config.orientation = DEFAULT_ORIENTATION;

		}

	} else { config.orientation = DEFAULT_ORIENTATION; }


	// Callback methods

	// TODO: Find way to not call this on internal moves
	function callOnChange( oldPos ) {

		if ( typeof ( config.onChange ) === 'function' ) {

			var newPos = generatePos();

			// TODO: Only call if the position was changed (compare objects)
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

			// TODO: Only call if the position was changed (compare objects)
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
			if ( source.type === 'square' ) { piece = source.getPiece().name; }

			source = source.name;
			target = target.name;

			config.onSnapEnd( source, target, piece );

		}

	}

	// TODO: Config - user defined start position
	// TODO: Config - show errors
	// TODO: Config - spare pieces
	// TODO: Config - notation
	// TODO: Config - shorthands ('start', fen, position instead of config object)
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
	var camera = new THREE.PerspectiveCamera( 60, width / height, 0.1, 1000 );
	camera.position.set( config.orientation.x,
						 config.orientation.y,
						 config.orientation.z );
	camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );


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
	orbitControls.minDistance = 1;
	orbitControls.maxDistance = MAX_SCROLLOUT_DISTANCE;
	orbitControls.enablePan = false;
	orbitControls.zoomSpeed = 1.0;
	orbitControls.rotateSpeed = 1.0;
	orbitControls.minPolarAngle = 0;
	orbitControls.maxPolarAngle = Math.PI;
	orbitControls.enabled = false;

	// Restrict camera distance to MAX_SCROLLOUT_DISTANCE
	orbitControls.update();

	// Apply turnable config option
	if ( config.turnable === true ) { orbitControls.enabled = true; }


	// Drag controls
	var draggable = [];

	var dragControls = new THREE.DragControls( draggable, false, camera, renderer.domElement );
 	dragControls.enabled = false;

	if ( config.draggable === true ) {

		dragControls.enabled = true;

		dragControls.addEventListener( 'dragstart', onDragStart );
		dragControls.addEventListener( 'dragend', onDragEnd );

		renderer.domElement.addEventListener( 'mousemove', onMouseMove );

	}


	// DEBUG
	//var axesHelper = new THREE.AxesHelper( 10 );
	//scene.add( axesHelper );


	// TODO: Make into API method
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
	// TODO: Remove, replaced by MAIN_SQUARES
	var MAIN_SQUARES_OLD = [
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

	// TODO: Remove, replaced by TOWER_SQUARES
	var TOWER_SQUARES_OLD = [
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
	loadModel( config.boardTheme.board ).then( function( model ) {

		boardMod.geometry = model.geometry;
		boardMod.material = model.material;

	} );

	var standMod = new THREE.Mesh();
	standMod.position.set( offset.x, offset.y, offset.z );
	board.add( standMod );
	loadModel( config.boardTheme.stand ).then( function( model ) {

		standMod.geometry = model.geometry;
		standMod.material = model.material;

	} );

	// Enable/disable stand
	standMod.visible = config.stand;


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
	for ( let squ in MAIN_SQUARES ) {

		// Get position
		let pos = MAIN_SQUARES[ squ ];

		// Add square
		let square = new Square( squ, pos );
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
	var towMod = loadModel( config.boardTheme.tower );
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
	for ( let i = 1; i <= 12; i++ ) {

		let squares = [];

		// Tower name
		let tow = 'T' + i;

		for ( let squ in TOWER_SQUARES[ tow ] ) {

			// Get position
			let pos = TOWER_SQUARES[ tow ][ squ ];

			// Add square
			let square = new Square( squ, pos );
			squares.push( square );

		}

		// Add tower
		let tower = new Tower( tow, i, squares );
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
				// TODO: Surely this needs to be enabled again somewhere?
				dragControls.enabled = false;
				onDragEnd();

			}

		}

	}


	function onDragEnd( event ) {

		orbitControls.enabled = config.turnable;

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

				// Needs to be called before move, otherwise source === target
				callOnSnapEnd( selected, target );

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


	// TODO: Check if valid fen string
	// TODO: Replace with loadPos( fenToObj( fen ) )
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


	// TODO: Replace with objToFen( generatePos )
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

		if ( isValidPos( pos ) ) {

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

		else if ( typeof( arg ) === 'object' ) { loadPos( arg ); }

		else if ( typeof( arg ) === 'string' ) { loadFen( arg ); }

	}


	// ----------------------------------------------------------------
	// Stand enabling/disabling
	// ----------------------------------------------------------------

	function stand( enabled ) {

		if ( enabled === true ) { standMod.visible = true; }
		else if ( enabled === false ) { standMod.visible = false; }
		else { return standMod.visible; }

	}


	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// API
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	// Load position
	if ( config.position !== undefined ) {

		position( config.position );

	} else { loadFen( EMPTY_BOARD_FEN ); }

	// Return object with API methods
	return {

		// TODO: Remove add/remove functions (Should be handled over position()?)
		add: function( target, piece ) { add( target, piece ); },

		remove: function( target ) { remove( target ); },

		move: function( args ) {

			// If no moves exist, do nothing
			if ( arguments.length === 0 ) { return; }

			for ( let i = 0; i < arguments.length; i++ ) {

				let mov = arguments[ i ];

				// Remove whitespace
				mov = mov.replace( /\s/g, '' );

				// Skip move if invalid
				if ( !isValidMove( mov ) ) { console.log("Invalid move"); continue; }

				// Perform move
				let squares = mov.split( '-' );
				move( squares[ 0 ], squares[ 1 ] );

			}

			return position();

		},

		clear: function() { position( {} ); },

		position: function( arg ) { return position( arg ); },

		fen: function() { return position( 'fen' ); },

		objToFen: function( pos ) { return objToFen( pos ); },

		fenToObj: function( fen ) { return fenToObj( fen ); },

		start: function() { position( 'start' ); },

		stand: function( enabled ) { return stand( enabled ); },

		// TODO: Make into separate function
		orientation: function( arg ) {

			if ( arguments.length === 0 ) {

				if ( currentOrientation === 'white' || currentOrientation === 'black' ) {

					return currentOrientation;

				} else {

					return { x: Number ( camera.position.x.toFixed(2) ),
							 y: Number ( camera.position.y.toFixed(2) ),
							 z: Number ( camera.position.z.toFixed(2) ) };

				}

			}

			if ( typeof( arg ) === 'string' && arg.toLowerCase() === 'white' ) {

				camera.position.set( WHITE_ORIENTATION.x,
									 WHITE_ORIENTATION.y,
									 WHITE_ORIENTATION.z );

				orbitControls.update();

				currentOrientation = 'white';

			}

			if ( typeof( arg ) === 'string' && arg.toLowerCase() === 'black' ) {

				camera.position.set( BLACK_ORIENTATION.x,
									 BLACK_ORIENTATION.y,
									 BLACK_ORIENTATION.z );

				orbitControls.update();

				currentOrientation = 'black';

			}

			if ( typeof( arg ) === 'string' && arg.toLowerCase() === 'flip' ) {

				if ( currentOrientation === 'white' ) {

					this.orientation( 'black' );

				} else if ( currentOrientation === 'black' ) {

					this.orientation( 'white' );

				}

			}

			// TODO: Does it make sense to have this option?
			if ( typeof( arg ) === 'string' && arg.toLowerCase() === 'reset' ) {

				currentOrientation = null;

			}

			if ( typeof( arg ) === 'object' && isValidOrientation( arg ) ) {

				camera.position.set( arg.x, arg.y, arg.z );
				orbitControls.update();

				currentOrientation = null;

			}
		}


	}


}
