# Documentation

tridchessboard.js is heavily inspired by [chessboard.js] and its API is kept almost identical.
This enables you use most of the numerous examples that exist for [chessboard.js].
So if you can figure out how to do something using this documentation, chances are you can find a working example for [chessboard.js] and apply it to your use case.


## Differences to chessboard.js

That said, there are some ways in which tridchessboard.js differs from [chessboard.js].
Some methods and properties have been left out, added or changed.
Either to work better with a Tri-D chessboard or because I was just to lazy to implement them.
The most notable changes are the adaptation of the [Position Object](#position-object) and [FEN String](#fen-string) for Tri-D chess and the introduction of the [Notation-](#notation-object) and [Orientation Object](#orientation-object) as well as the `blackOrientation`, `whiteOrientation` and `boardTheme` config properties.

Here is a list of all the changes/differences:

* [Config Properties](#config-properties)
	* Missing `onMouseoutSquare`
	* Missing `onMouseoverSquare`
	* Missing `appearSpeed` (pieces/towers appear instantly)
	* Missing `moveSpeed` (no move animation, pieces/towers move instantly)
	* Missing `snapbackSpeed` (no snapback animation, pieces/towers snapback instantly)
	* Missing `snapSpeed` (no snap animation, pieces/towers snap instantly)
	* Missing `trashSpeed` (no trash animation, pieces/towers disapear instantly)
	* Added `boardTheme`
	* Added `whiteOrientation` and `blackOrientation`
	* Added `stand`
	* Added `turnable`
	* Changed `orientation` (can now be [Orientation Object](#orientation-object) as well as 'white' or 'black')
* [Methods](#methods)
	* Added `stand()` and `stand( enabled )`
	* Changed `clear()` (no useAnimation argument, position changes instantly)
	* Changed `position( newPosition )` (no useAnimation argument, position changes instantly)
	* Changed `start()` (no useAnimation argument, position changes instantly)
* [Position Object](#position-object)
	* Adapted square names for three dimensions
	* Added towers
* [FEN String](#fen-string)
	* Added Towers
* Added [Orientation Object](#orientation-object)


## Config Properties

| Property           | Type                                   | Default                             | Description
|---------------     |--------------------                    |-----                                |------------------------------------------------------------
| draggable          | Boolean                                | false                               | Enables/disables dragging of pieces and towers.
| turnable           | Boolean                                | false                               | Enables/disables turning/zooming of board.
| dropOffBoard       | 'snapback' or 'trash'                  | 'snapback'                          | Specifies what happens when a piece/tower is dropped off the board. <br> If 'snapback', piece/tower moves back to original position. <br> If 'trash', piece/tower is removed.
| position           | 'start', FEN String or Position Object | n/a                                 | Sets initial board position.
| onChange           | Function                               | n/a                                 | Called when board position changes. <br> Arguments: old position, new position.
| onDragStart        | Function                               | n/a                                 | Called when piece/tower is picked up. <br> Arguments: source, piece/tower, current position, current orientation. <br> If this returns false the drag is cancelled.
| onDragMove         | Function                               | n/a                                 | Called when dragged piece/tower changes location. <br> Arguments: new location, old location, source, piece/tower, current position, current orientation
| onDrop             | Function                               | n/a                                 | Called when piece is dropped. <br> Arguments: source, target, piece/tower, new position, old position, current orientation. <br> If this returns 'snapback', piece/tower moves back to source. <br> If this returns 'trash', piece/tower is removed. <br> **!!! The new position argument is currently broken and returns the old position instead !!!**
| onMoveEnd          | Function                               | n/a                                 | Called at the end of a move, when the board position changes. <br> Arguments: old position, new position. <br> (Basically the same as onChange, kept for compatability to chessboard.js)
| onSnapbackEnd      | Function                               | n/a                                 | Called when "snapback" of piece/tower is complete. <br> Arguments: piece/tower, source, current position, current orientation.
| onSnapEnd          | Function                               | n/a                                 | Called at the end of a move, when board position changes. <br> Arguments: source, target, piece/tower.
| orientation        | 'white', 'black' or Orientation Object | { x: -10, <br>  y: 7, <br>  z: 10 } | Sets initial board orientation (camera position).
| whiteOrientation   | Orientation Object                     | { x: -12, <br>  y: 10, <br>  z: 0 } | Sets 'white' board orientation (camera position).
| blackOrientation   | Orientation Object                     | { x: 5, <br>  y: 15, <br>  z: 0 }   | Sets 'black' board orientation (camera position).
| showNotation       | Boolean                                | false                               | Enable/disable board notation. <br> **!!! Not implemented yet. !!!**
| sparePieces        | Boolean                                | false                               | Enable/disable spare pieces that can be dragged onto the board. If enabled, enables draggable as well. <br> **!!! Not implemented yet. !!!**
| showErrors         | false, String or Function              | n/a                                 | Choose how errors are reported. <br> If false, errors are ignored. <br> If 'console', errors output to console.log(). <br> If 'alert', errors output to window.alert(). <br> If function, it is called with following arguments: error code, error string, data. <br> **!!! Not implemented yet. !!!**
| pieceTheme         | String or Function                     | ''                                  | Source of piece models. <br> **!!! Not implemented yet. !!!**
| boardTheme         | String or Function                     | ''                                  | Source of board models. <br> **!!! Not implemented yet. !!!**
| stand              | Boolean                                | true                                | Enable/disables visibility of stand model.


## Methods

| Method                    | Arguments                              | Description
|--------------------       |--------------------                    |------------------------------------------------------------
| clear()                   | none                                   | Removes all pieces and towers from the board. <br> Same as position( {} )
| destroy()                 | none                                   | Removes chessboard from the DOM. <br> **!!! Not implemented yet. !!!**
| fen()                     | none                                   | Returns current position as FEN String. Same as position( 'fen' )
| flip()                    | none                                   | Flips board orientation. Same as orientation( 'flip' )
| move( move1, move2, ... ) | 'c3_1-c4_2', 'T1-T5', etc              | Performs the move(s) given as arguments. Returns the new board position.
| position( fen )           | 'fen' (optional)                       | Returns the current board position. If 'fen', returns FEN String.
| position( newPosition )   | Position Object, FEN String or 'start' | Sets the board position to the position given as argument.
| orientation()             | none                                   | Returns the current board orientation.
| orientation( side )       | 'white', 'black' or 'flip'             | If 'white' or 'black', sets orientation. <br> If 'flip', flips orientation.
| resize()                  | none                                   | Resizes board based on size of parent DIV. <br> **!!! Not implemented yet. !!!**
| start()                   | none                                   | Sets the board position to the start position. Same as position( 'start')
| stand()                   | none                                   | Returns the current visibility of the stand model. Enabled (true) or disabled (false).
| stand( enabled )          | true or false                          | Enables/disables visibility of stand model.


## Position Object

Work in progress.


## FEN String

Work in progress.


## Orientation Object

Work in progress.


## Notation Object

Work in progress.


## Errors

Work in progress.


[chessboard.js]: https://github.com/oakmac/chessboardjs
