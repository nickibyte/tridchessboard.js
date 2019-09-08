
/*	var board = [ [ [ null, 'a1^2', null,null,null,null ],
	           	    [ null, 'a2^2', null,null,null,null ],
	           	    [ null, null, null,'a3^4',null,null ],
	           	    [ null, null, null,'a4^4',null,null ],
	           	    [ null, 'a5^2', null,null,null,'a5^6' ],
	           	    [ null, 'a6^2', null,null,null,'a6^6' ],
	           	    [ null, null, null,'a7^4',null,null ],
	           	    [ null, null, null,'a8^4',null,null ],
	           	    [ null, null, null,null,null,'a9^6' ],
	           	    [ null, null, null,null,null,'a10^6' ] ],
	              [ [ null, 'b1^2', null,null,null,null ],
	                [ 'b2^1', 'b2^2', null,null,null,null ],
	                [ 'b3^1', null, null,'b3^4',null,null ],
	                [ 'b4^1', null, 'b4^3','b4^4',null,null ],
	                [ 'b5^1', 'b5^2', 'b5^3',null,null,'b5^6' ],
	                [ null, 'b6^2', 'b6^3',null,'b6^5','b6^6' ],
	                [ null, null, 'b7^3','b7^4','b7^5',null ],
	                [ null, null, null,'b8^4','b8^5',null ],
	                [ null, null, null,null,'b9^5','b9^6' ],
	                [ null, null, null,null,null,'b10^6' ] ],
	              [ [ null, null, null,null,null,null ],
	                [ 'c2^1', null, null,null,null,null ],
	                [ 'c3^1', null, null,null,null,null ],
	                [ 'c4^1', null, 'c4^3',null,null,null ],
	                [ 'c5^1', null, 'c5^3',null,null,null ],
	                [ null, null, 'c6^3',null,'c6^5',null ],
	                [ null, null, 'c7^3',null,'c7^5',null ],
	                [ null, null, null,null,'c8^5',null ],
	                [ null, null, null,null,'c9^5',null ],
	                [ null, null, null,null,null,null ] ],
	              [ [ null, null, null,null,null,null ],
	                [ 'd2^1', null, null,null,null,null ],
	                [ 'd3^1', null, null,null,null,null ],
	                [ 'd4^1', null, 'd4^3',null,null,null ],
	                [ 'd5^1', null, 'd5^3',null,null,null ],
	                [ null, null, 'd6^3',null,'d6^5',null ],
	                [ null, null, 'd7^3',null,'d7^5',null ],
	                [ null, null, null,null,'d8^5',null ],
	                [ null, null, null,null,'d9^5',null ],
	                [ null, null, null,null,null,null ] ],
	              [ [ null, 'e1^2', null,null,null,null ], 
	                [ 'e2^1', 'e2^2', null,null,null,null ],
	                [ 'e3^1', null, null,'e3^4',null,null ],
	                [ 'e4^1', null, 'e4^3','e4^4',null,null ],
	                [ 'e5^1', 'e5^2', 'e5^3',null,null,'e5^6' ],
	                [ null, 'e6^2', 'e6^3',null,'e6^5','e6^6' ],
	                [ null, null, 'e7^3','e7^4','e7^5',null ],
	                [ null, null, null,'e8^4','e8^5',null ],
	                [ null, null, null,null,'e9^5','e9^6' ],
	                [ null, null, null,null,null,'e10^6' ] ],
	              [ [ null, 'f1^2', null,null,null,null ],
	                [ null, 'f2^2', null,null,null,null ],
	                [ null, null, null,'f3^4',null,null ],
	                [ null, null, null,'f4^4',null,null ],
	                [ null, 'f5^2', null,null,null,'f5^6' ],
	                [ null, 'f6^2', null,null,null,'f6^6' ],
	                [ null, null, null,'f7^4',null,null ],
	                [ null, null, null,'f8^4',null,null ],
	                [ null, null, null,null,null,'f9^6' ],
	                [ null, null, null,null,null,'f10^6' ] ] ]; */

// Global Position Object

var Pos = function(file, row, level) {

	this.f = file;
	this.r = row;
	this.l = level;

}


var Tridchess = function(fen, notation) {
	

	// ------------------------------------------------------------------------
	// Constants
	// ------------------------------------------------------------------------

	var TOWER_SQUARES = [  // Low board 
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


	// Board (6x10x6): Non existing squares are null, empty squares zero
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
                          [    0, null, null, null, null, null ],
                          [    0, null, null, null, null, null ],
                          [    0, null,    0, null, null, null ],
                          [    0, null,    0, null, null, null ],
                          [ null, null,    0, null,    0, null ],
                          [ null, null,    0, null,    0, null ],
                          [ null, null, null, null,    0, null ],
                          [ null, null, null, null,    0, null ],
                          [ null, null, null, null, null, null ] ],

                        [ [ null, null, null, null, null, null ],
                          [    0, null, null, null, null, null ],
                          [    0, null, null, null, null, null ],
                          [    0, null,    0, null, null, null ],
                          [    0, null,    0, null, null, null ],
                          [ null, null,    0, null,    0, null ],
                          [ null, null,    0, null,    0, null ],
                          [ null, null, null, null,    0, null ],
                          [ null, null, null, null,    0, null ],
                          [ null, null, null, null, null, null ] ],

                        [ [ null, null, null, null, null, null ],
                          [    0, null, null, null, null, null ],
                          [    0, null, null, null, null, null ],
                          [    0, null,    0, null, null, null ],
                          [    0, null,    0, null, null, null ],
                          [ null, null,    0, null,    0, null ],
                          [ null, null,    0, null,    0, null ],
                          [ null, null, null, null,    0, null ],
                          [ null, null, null, null,    0, null ],
                          [ null, null, null, null, null, null ] ],

                        [ [ null, null, null, null, null, null ], 
                          [    0, null, null, null, null, null ],
                          [    0, null, null, null, null, null ],
                          [    0, null,    0, null, null, null ],
                          [    0, null,    0, null, null, null ],
                          [ null, null,    0, null,    0, null ],
                          [ null, null,    0, null,    0, null ],
                          [ null, null, null, null,    0, null ],
                          [ null, null, null, null,    0, null ],
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
		pieces: [ '', 'N', 'B', 'R', 'Q', 'K' ]
	
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
	
	loadFen(DEFAULT_STARTING_FEN);
	moveTower(1,3);

	function addTowers(towers) {

		for (var i = 0; i < towers.length; i++) {

			// Get tower squares from tower positions
			var towerSquares = TOWER_SQUARES[ towers[i] - 1 ];

			for (var j = 0; j < towerSquares.length; j++) {

				// Add an empty square for each tower square
				var pos = towerSquares[j];
				place(0, pos);

			}

		}

	}
			
	function loadFen(fen) {

		// Reset
		board = MAIN_BOARDS;
		towers = [];

		var fields = fen.split(' ');
		console.log("Got fields from fen: " + fields);

		// Get tower positions
		var towerPos = fields[0].split('');
		console.log("Got tower positions from fen: " + towerPos);

		// Convert 12-base position to integer
		for (var i = 0; i < towerPos.length; i++) {
			
			towerPos[i] = parseInt(towerPos[i], 13);

		}
		console.log("Converted tower positions to: " + towerPos)

		// Set towers and add them to the static board
		towers = towerPos;
		addTowers(towers);

		//// Get piece positions
		//var position = fields[1].split('/');

		//var file = fen.split('/', 10);
		//fen = fen.slice(10);
		//
		//for (var i = 0; i < file.length; i++) {

		//	file[i] = file[i].split('');

		//}

	}

	function place(value, pos) {

		board[pos.f][pos.r][pos.l] = value;

	}

	function move(from, to, newFrom = 0) {

		board[to.f][to.r][to.l] = board[from.f][from.r][from.l];
		board[from.f][from.r][from.l] = newFrom;

	}

	// ------------------------------------------------------------------------
	// Public methods and variables
	// ------------------------------------------------------------------------

	this.towerSquares = TOWER_SQUARES;
	
	this.getBoard = function() { return board; }
	this.getTowers = function() { return towers; }

	this.movePiece = function(from, to) { move(from, to); }

	function moveTower(from, to) { // TO-DO: Revert to public method

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
