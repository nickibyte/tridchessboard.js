
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


var Tridchess = new function(notation) {
	
	
	var DEFAULT_NOTATION = {
	
		rows: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
		files: [ 'a', 'b', 'c', 'd', 'e', 'f' ],
		levels: [ 1, 2, 3, 4, 5, 6 ],
		towers: [ 'L1', 'L2', 'L3', 'L4', 'M1', 'M2', 'M3', 'M4', 'H1', 'H2', 'H3', 'H4' ],
		pieces: [ '', 'N', 'B', 'R', 'Q', 'K', '', 'N', 'B', 'R', 'Q', 'K' ] // Pawn, Knight, Bishop, Rook, Queen, King
	
	};

	// Board (6x10x6): Non existing squares are null
	var board = [ [ [ null,	   4, null, null, null, null ],
	           	    [ null,    1, null, null, null, null ],
	           	    [ null, null, null, null, null, null ],
	           	    [ null, null, null, null, null, null ],
	           	    [ null, null, null, null, null, null ],
	           	    [ null, null, null, null, null, null ],
	           	    [ null, null, null, null, null, null ],
	           	    [ null, null, null, null, null, null ],
	           	    [ null, null, null, null, null, 7 ],
	           	    [ null, null, null, null, null, 10 ] ],
	              [ [ null,    2, null, null, null, null ],
	                [    1,    3, null, null, null, null ],
	                [    1, null, null, null, null, null ],
	                [    0, null,    0, null, null, null ],
	                [    0, null,    0, null, null, null ],
	                [ null, null,    0, null,    0, null ],
	                [ null, null,    0, null,    0, null ],
	                [ null, null, null, null, 7, null ],
	                [ null, null, null, null, 7, 9 ],
	                [ null, null, null, null, null, 8 ] ],
	              [ [ null, null, null, null, null, null ],
	                [ 5, null, null, null, null, null ],
	                [ 1, null, null, null, null, null ],
	                [    0, null,    0, null, null, null ],
	                [    0, null,    0, null, null, null ],
	                [ null, null,    0, null,    0, null ],
	                [ null, null,    0, null,    0, null ],
	                [ null, null, null, null, 7, null ],
	                [ null, null, null, null, 11, null ],
	                [ null, null, null, null, null, null ] ],
	              [ [ null, null, null, null, null, null ],
	                [ 6, null, null, null, null, null ],
	                [ 1, null, null, null, null, null ],
	                [    0, null,    0, null, null, null ],
	                [    0, null,    0, null, null, null ],
	                [ null, null,    0, null,    0, null ],
	                [ null, null,    0, null,    0, null ],
	                [ null, null, null, null, 7, null ],
	                [ null, null, null, null, 12, null ],
	                [ null, null, null, null, null, null ] ],
	              [ [ null, 2, null, null, null, null ], 
	                [ 1, 3, null, null, null, null ],
	                [ 1, null, null, null, null, null ],
	                [    0, null,    0, null, null, null ],
	                [    0, null,    0, null, null, null ],
	                [ null, null,    0, null,    0, null ],
	                [ null, null,    0, null,    0, null ],
	                [ null, null, null, null, 7, null ],
	                [ null, null, null, null, 7, 9 ],
	                [ null, null, null, null, null, 8 ] ],
	              [ [ null, 4, null, null, null, null ],
	                [ null, 1, null, null, null, null ],
	                [ null, null, null, null, null, null ],
	                [ null, null, null, null, null, null ],
	                [ null, null, null, null, null, null ],
	                [ null, null, null, null, null, null ],
	                [ null, null, null, null, null, null ],
	                [ null, null, null, null, null, null ],
	                [ null, null, null, null, null, 7 ],
	                [ null, null, null, null, null, 10 ] ] ];
	
	var TOWER_POSITIONS;
	var towers = [ 1, 2, 11, 12 ];

	this.getBoard = function() { return board };

	this.movePiece = function(from, to, options) {

		board[to.file][to.rank][to.level] = board[from.file][from.rank][from.level];
		board[from.file][from.rank][from.level] = 0;
		
	}

	this.moveTower = function(from, to, options) {

		// Update tower positions
		towers.splice(towers.indexOf(from), 1, to);
		
		// Update board
		var from = TOWER_POSITIONS[from];
		var to = TOWER_POSITIONS[to];

		for (var i = 0; i < from.length; i++) {
			
			movePiece(from[i], to[i]);
			board[from[i].file][from[i].rank][from[i].level] = null;

		}

	}

}
