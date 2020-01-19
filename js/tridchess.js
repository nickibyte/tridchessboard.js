// ----------------------------------------------------------------
// ----------------------------------------------------------------
// Globals
// ----------------------------------------------------------------
// ----------------------------------------------------------------

export var Pos = function(file, row, level) {

	this.f = file;
	this.r = row;
	this.l = level;

}

export var TOWER_SQUARES = [ // Low board 
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
					  [ new Pos(4,8,5), new Pos(5,8,5), new Pos(4,9,5), new Pos(5,9,5) ] ];

export var MAIN_SQUARES = [ // Low board 
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
					 new Pos(1,8,4), new Pos(2,8,4), new Pos(3,8,4), new Pos(4,8,4) ];


// ----------------------------------------------------------------
// ----------------------------------------------------------------
// Tri-D-Chess
// ----------------------------------------------------------------
// ----------------------------------------------------------------

export var Tridchess = function(fen, notation) {
	

	// Board (6x10x6): Non existing squares are null, empty squares empty strings
	// TODO: Generate MAIN_BOARDS from MAIN_SQUARES
	var MAIN_BOARDS = [ [ [ null, null, null, null, null, null ], 
                          [ null, null, null, null, null, null ],
                          [ null, null, null, null, null, null ],
                          [ null, null, null, null, null, null ],
                          [ null, null, null, null, null, null ],
                          [ null, null, null, null, null, null ],
                          [ null, null, null, null, null, null ],
                          [ null, null, null, null, null, null ],
                          [ null, null, null, null, null, null ],
                          [ null, null, null, null, null, null ] ],

                        [ [ null, null, null, null, null, null ],
                          [  ' ', null, null, null, null, null ],
                          [  ' ', null, null, null, null, null ],
                          [  ' ', null,  ' ', null, null, null ],
                          [  ' ', null,  ' ', null, null, null ],
                          [ null, null,  ' ', null,  ' ', null ],
                          [ null, null,  ' ', null,  ' ', null ],
                          [ null, null, null, null,  ' ', null ],
                          [ null, null, null, null,  ' ', null ],
                          [ null, null, null, null, null, null ] ],

                        [ [ null, null, null, null, null, null ],
                          [  ' ', null, null, null, null, null ],
                          [  ' ', null, null, null, null, null ],
                          [  ' ', null,  ' ', null, null, null ],
                          [  ' ', null,  ' ', null, null, null ],
                          [ null, null,  ' ', null,  ' ', null ],
                          [ null, null,  ' ', null,  ' ', null ],
                          [ null, null, null, null,  ' ', null ],
                          [ null, null, null, null,  ' ', null ],
                          [ null, null, null, null, null, null ] ],

                        [ [ null, null, null, null, null, null ],
                          [  ' ', null, null, null, null, null ],
                          [  ' ', null, null, null, null, null ],
                          [  ' ', null,  ' ', null, null, null ],
                          [  ' ', null,  ' ', null, null, null ],
                          [ null, null,  ' ', null,  ' ', null ],
                          [ null, null,  ' ', null,  ' ', null ],
                          [ null, null, null, null,  ' ', null ],
                          [ null, null, null, null,  ' ', null ],
                          [ null, null, null, null, null, null ] ],

                        [ [ null, null, null, null, null, null ], 
                          [  ' ', null, null, null, null, null ],
                          [  ' ', null, null, null, null, null ],
                          [  ' ', null,  ' ', null, null, null ],
                          [  ' ', null,  ' ', null, null, null ],
                          [ null, null,  ' ', null,  ' ', null ],
                          [ null, null,  ' ', null,  ' ', null ],
                          [ null, null, null, null,  ' ', null ],
                          [ null, null, null, null,  ' ', null ],
                          [ null, null, null, null, null, null ] ],

                        [ [ null, null, null, null, null, null ],
                          [ null, null, null, null, null, null ],
                          [ null, null, null, null, null, null ],
                          [ null, null, null, null, null, null ],
                          [ null, null, null, null, null, null ],
                          [ null, null, null, null, null, null ],
                          [ null, null, null, null, null, null ],
                          [ null, null, null, null, null, null ],
                          [ null, null, null, null, null, null ],
                          [ null, null, null, null, null, null ] ] ]; 

	// Defaults
	var DEFAULT_NOTATION = {
	
		rows: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
		files: [ 'a', 'b', 'c', 'd', 'e', 'f' ],
		levels: [ 1, 2, 3, 4, 5, 6 ],
		towers: [ 'L1', 'L2', 'L3', 'L4',
				  'M1', 'M2', 'M3', 'M4',
				  'H1', 'H2', 'H3', 'H4' ],
		// Pieces: Pawn, Knight, Bishop, Rook, Queen, King
		pieces: { p: '', n: 'N', b: 'B', r: 'R', q: 'Q', k: 'K' }
	
	};

	var DEFAULT_STARTING_FEN = "12bc R/P///////p/r/N/PB/P/2/2/2/2/p/pb/n//Q/P/2/2/2/2/p/q///K/P/2/2/2/2/p/k//N/PB/P/2/2/2/2/p/pb/n/R/P///////p/r w KQkq - 0 1";


	// ------------------------------------------------------------------------
	// Init
	// ------------------------------------------------------------------------
	
	// Apply settings or load defaults
	if (notation === undefined) { notation = DEFAULT_NOTATION; }
	if (fen === undefined) { fen = DEFAULT_STARTING_FEN; }

	var board = MAIN_BOARDS;
	var towers = [];
	
	loadFen(fen);

	function addTowers(towers) {

		for (var i = 0; i < towers.length; i++) {

			// Get tower squares from tower positions
			var towerSquares = TOWER_SQUARES[ towers[i] - 1 ];

			for (var j = 0; j < towerSquares.length; j++) {

				// Add an empty square for each tower square
				var pos = towerSquares[j];
				place(' ', pos);

			}

		}

	}
			
	function loadFen(fen) {

		// Reset
		board = MAIN_BOARDS;
		towers = [];

		var fields = fen.split(' ');

		// Get tower positions
		var towerPos = fields[0].split('');

		// Convert 12-base position to integer
		for (var i = 0; i < towerPos.length; i++) {
			
			towerPos[i] = parseInt(towerPos[i], 13);

		}

		// Set towers and add them to the static board
		towers = towerPos;
		addTowers(towers);


		// Get piece positions
		var position = fields[1].split('/'); // Remove slashes
		position = position.join('');

		// Expand empty squares
		for (var i = 0; i < position.length; i++) {

			if ('0123456789'.indexOf(position[i]) !== -1) { // Is number
				
				// Replace number with number of spaces (3 ->    )
				var num = parseInt(position[i], 10);
				var str = new Array(num + 1).join(' ');
				position = position.replace(position[i], str);

			}

		}

		// Place pieces
		var i = 0;

		for (var f = 0; f < board.length; f++) {
			for (var r = 0; r < board[f].length; r++) {
				for (var l = 0; l < board[f][r].length; l++) {

					if (board[f][r][l] === ' ') {

						board[f][r][l] = position[i];
						i++;

					}

				}
			}
		}

	}


	function place(value, pos) {

		board[pos.f][pos.r][pos.l] = value;

	}

	function move(from, to, newFrom = ' ') {

		board[to.f][to.r][to.l] = board[from.f][from.r][from.l];
		board[from.f][from.r][from.l] = newFrom;

	}


	// ------------------------------------------------------------------------
	// Public methods and variables
	// ------------------------------------------------------------------------

	this.getBoard = function() { return board; }
	this.getTowers = function() { return towers; }

	this.placePiece = function(value, pos) { place(value, pos); } // TODO: Remove public or change
	this.movePiece = function(from, to) { move(from, to); }

	this.moveTower = function(from, to) { 

		// Update tower positions
		towers.splice(towers.indexOf(from), 1, to);
		
		// Move pieces and update tower squares
		var from = TOWER_SQUARES[from - 1];
		var to = TOWER_SQUARES[to - 1];

		for (var i = 0; i < from.length; i++) {
			
			move(from[i], to[i], null);

		}

	}

	this.load = function(fen) { loadFen(fen); }

}
