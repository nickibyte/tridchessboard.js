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
	* Changed `pieceTheme` (can now be pieceTheme Object as well as a string or function)
* [Methods](#methods)
	* Added `stand()` and `stand( enabled )`
	* Changed `clear()` (no useAnimation argument, position changes instantly)
	* Changed `position( newPosition )` (no useAnimation argument, position changes instantly)
	* Changed `start()` (no useAnimation argument, position changes instantly)
	* Changed `orientation()` (returns/takes [Orientation Object](#orientation-object) as well as 'white' or 'black', added 'reset' option)
* [Position Object](#position-object)
	* Adapted square names for three dimensions
	* Added towers
* [FEN String](#fen-string)
	* Added towers
	* Added levels to position data
* Added [Orientation Object](#orientation-object)
* Highlighting of squares/pieces is handled differently (using [Config Properties](#config-properties) rather than CSS classes)


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
| pieceTheme         | String, Function or pieceTheme Object  | '../assets/pieces/{piece}.glb'      | Source of piece models. <br> If string, '{piece}' is replaced by the piece codes (ie: bP, wK, bR, etc). <br> If function, first argument is the piece code and it should return a string containing the path to the piece model. <br> If object, property names should be piece codes and values should be strings containing the path to the piece model.
| boardTheme         | String, Function or boardTheme Object  | '../assets/board/{part}.glb'        | Source of board/tower models. <br> If string, '{part}' is replaced by 'board' for the main board model, 'tower' for the tower model and 'stand' for the stand model. <br> If function, first argument is 'board', 'tower', 'stand' and it should return a string containing the path to the corresponding model. <br> If object, property names should be 'board', 'tower', 'stand' and values should be strings containing the path to the corresponding model.
| stand              | Boolean                                | true                                | Enable/disables visibility of stand model.


## Methods

| Method                    | Arguments                                                  | Description
|--------------------       |--------------------                                        |------------------------------------------------------------
| clear()                   | none                                                       | Removes all pieces and towers from the board. <br> Same as position( {} )
| destroy()                 | none                                                       | Removes chessboard from the DOM. <br> **!!! Not implemented yet. !!!**
| fen()                     | none                                                       | Returns current position as FEN String. Same as position( 'fen' )
| flip()                    | none                                                       | Flips board orientation. Same as orientation( 'flip' )
| move( move1, move2, ... ) | 'c3_1-c4_2', 'T1-T5', etc                                  | Performs the move(s) given as arguments. Returns the new board position.
| position( fen )           | 'fen' (optional)                                           | Returns the current board position. If 'fen', returns FEN String.
| position( newPosition )   | Position Object, FEN String or 'start'                     | Sets the board position to the position given as argument.
| orientation()             | none                                                       | Returns the current board orientation.
| orientation( side )       | Orientation Object, 'white', 'black', 'flip' or 'reset'    | Sets orientation (camera position). <br> If 'white' or 'black', sets orientation to the whiteOrientation/blackOrientation config properties. <br> If 'flip', flips orientation between 'white' and 'black'. Only has an effect, if orientation has been set to 'white' or 'black' previously.
| resize()                  | none                                                       | Resizes board based on size of parent DIV. <br> **!!! Not implemented yet. !!!**
| start()                   | none                                                       | Sets the board position to the start position. Same as position( 'start')
| stand()                   | none                                                       | Returns the current visibility of the stand model. Enabled (true) or disabled (false).
| stand( enabled )          | true or false                                              | Enables/disables visibility of stand model.
| objToFen( obj )           | Position Object                                            | Takes a Position Object and returns the corresponding FEN String.
| fenToObj( fen )           | FEN String                                                 | Takes a FEN String and returns a corresponding Position Object.


## Position Object

The Position Object is a JavaScript object which contains a board position.

The properties of the object can be:

* squares (ie: c3_1, e7_5, etc) as property name and piece codes (ie: bP, wK, bR, etc) as values
* tower positions (T1, T2, ..., T12) as property name and true/false as values (indicating that the tower at that position does/doesn't exist)

The square names used by tridchessboard.js are algebraic (like in regular chess).
However the files range from a-f and the rank from 1-10 (instead of a-h and 1-8).
Additionally a suffix (underscore + number) is added to indicate the level 1-6.

The twelve possible tower positions are labled T1 through T12.
Starting with the front left tower on the bottom board (when looking at the board from the front) and then going **left to right** and **front to back** on each of the 3 main boards (**bottom to top**).

See an example of using a Position Object [here].

You can use Tridchessboard's `objToFen` method to convert a Position Object to a [FEN String](#fen-string).


## FEN String

[Forsyth-Edwards Notation (FEN)] is a way of representing the current state of a chessgame using a simple string.

> 12bc rnnr/pbbp//|pqkp/pppp/4/4|///|4/4/4/4|//PBBP/RNNR|4/4/PPPP/PQKP w KQkq - 0 1

For tridchessboard.js the notation has been extended to include the tower positions as the first field of the FEN String.
The tower positions (1-12) are converted to hexadecimal, so positions 1 to 9 remain the same while positions 10, 11 and 12 become a, b and c.
This way each position only takes up one character in the string.
In the example FEN String above the first field (12bc) tells us that there are four towers placed at positions 1, 2, 11 and 12.

The second field of the FEN String holds the piece positions.
Here the '|' (pipe symbol) has been added as a separator between the different levels of the Tri-D chessboard.
The '/' (forward slash) separates the rank on each level just like in regular FEN.

The piece placements are stored rank by rank in big-endian order (just like in regular FEN).
This means they start on the highest level (level 6) on the last rank (rank 10).
From there they go backwards through the ranks on each level before continuing with the next lower level.
Within a rank the pieces are stored in little-endian order (in the order of their file from a-f).

The pieces themselves are stored (just like in regular FEN) as a single letter according to the [Algebraic chess notation] (with 'p' for pawns).
Lowercase letters are used for black pieces and uppercase letters for white pieces.
The number of (continuous) empty squares is stored as a decimal digit.

The other fields of the FEN String hold castling and other move information and are ignored by tridchessboard.js.

Due to the asymmetric nature of the Tri-D chessboard, one has to take extra care when parsing the Tri-D FEN String.
Especially on tower levels where squares may or may not exist, depending on the tower positions.

You can use Tridchessboard's `fenToObj` method to convert a FEN String to a [Position Object](#position-object).


## Orientation Object

The Orientation Object is a JavaScript object which resemles a 3D-Vector and determines the camera position.

The Object must have the properties x, y and z.
The values of these properties must be a JavaScript Number.

The `orientation` method takes 'white' and 'black' as well as an Orientation Object.
These strings are translated into the `whiteOrientation` and the `blackOrientation` config properties, which themselves are Orientation Objects.

A call to `orientation( 'flip' )` only has an effect if the orientation has previously been set to 'white' or 'black'.
Either by the `orientation` config property or the `orientation` method.


## Notation Object

Work in progress.


## Errors

Work in progress.


[chessboard.js]: https://github.com/oakmac/chessboardjs
[Forsyth-Edwards Notation (FEN)]: https://en.wikipedia.org/wiki/Forsyth-Edwards_Notation
[Algebraic chess notation]: https://en.wikipedia.org/wiki/Algebraic_notation_(chess)
