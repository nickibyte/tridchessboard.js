# Documentation

tridchessboard.js is heavily inspired by [chessboard.js] and its API is kept almost identical.
This enables you use most of the numerous examples that exist for [chessboard.js].
So if you can figure out how to do something using this documentation, chances are you can find a working example for [chessboard.js] and apply it to your use case.

That said, there are some ways in which tridchessboard.js differs from [chessboard.js].
Some methods and properties have been left out, added or changed.
Either to work better with a Tri-D chessboard or because I was just to lazy to implement them.
The most notable changes are the adaptation of the [Position Object](#position-object) and [FEN String](#fen-string) for Tri-D chess as well as the introduction of the [Notation Object](#notation-object), [Orientation Object](#orientation-object) and the `blackOrientation`, `whiteOrientation` and `boardTheme` config properties.


## Config Properties

| Property      | Type                                   | Default                 | Description                                                                                       |
|---------------|----------------------------------------|-------------------------|---------------------------------------------------------------------------------------------------|
| draggable     | Boolean                                | false                   | Enables/disables dragging of pieces and towers
| dropOffBoard  | 'snapback' or 'trash'                  | 'snapback'              | Specifies what happens when a piece/tower is dropped off the board. <br> If 'snapback', piece/tower moves back to original position. <br> If 'trash', piece/tower is removed.
| position      | 'start', FEN String or Position Object | n/a                     | Sets initial board position.
| onChange      | Function                               | n/a                     | Called when board position changes. <br> Arguments: old position, new position.
| onDragStart   | Function                               | n/a                     | Called when piece/tower is picked up. Arguments: source, piece/tower, current position, current orientation. If this returns false the drag is cancelled.
| onDragMove    | Function                               | n/a                     | Called when dragged piece/tower changes location. Arguments: new location, old location, source, piece/tower, current position, current orientation
| onDrop        | Function                               | n/a                     | Called when piece is dropped. Arguments: source, target, piece/tower, new position, old position, current orientation. If this returns 'snapback', piece/tower moves back to source. If this returns 'trash', piece/tower is removed. !!! The new position argument is currently broken and returns the old position instead !!!
| onMoveEnd     | Function                               | n/a                     | Called at the end of a move, when the board position changes. Arguments: old position, new position. (Basically the same as onChange, kept for compatability to chessboard.js)
| onSnapbackEnd | Function                               | n/a                     | Called when "snapback" of piece/tower is complete. Arguments: piece/tower, source, current position, current orientation.
| onSnapEnd     | Function                               | n/a                     | Called at the end of a move, when board position changes. Arguments: source, target, piece/tower.
| orientation   | 'white', 'black' or Orientation Object | { x: -10, y: 7, z: 10 } | Sets initial board orientation.
| showNotation  | Boolean                                | false                   | Enable/disable board notation. !!! Not implemented yet. !!!
| sparePieces   | Boolean                                | false                   | Enable/disable spare pieces that can be dragged onto the board. !!! Not implemented yet. !!!
| showErrors    | false, String or Function              | n/a                     | Choose how errors are reported. If false, errors are ignored. If 'console', errors output to console.log(). If 'alert', errors output to window.alert(). If function, it is called with following arguments: error code, error string, data. !!! Not implemented yet. !!!
| pieceTheme    | String or Function                     | ''                      | Source of piece models. !!! Not implemented yet. !!!
| boardTheme    | String or Function                     | ''                      | Source of board models. !!! Not implemented yet. !!!

The following [chessboard.js] properties are not implemented:

* `onMouseoutSquare`
* `onMouseoverSquare`
* `appearSpeed` (pieces/towers appear instantly)
* `moveSpeed` (no move animation, pieces/towers move instantly)
* `snapbackSpeed` (no snapback animation, pieces/towers snapback instantly)
* `snapSpeed` (no snap animation, pieces/towers snap instantly)
* `trashSpeed` (no trash animation, pieces/towers disapear instantly)


## Methods

Work in progress.


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
