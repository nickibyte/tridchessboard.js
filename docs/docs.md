# Documentation

## Config Properties

Most of the config properties are the same as in [chessboard.js], however some have been added or changed to work better with a Tri-D chessboard.

| Property      | Type               | Default    | Description                                                                                       |
|---------------|--------------------|------------|---------------------------------------------------------------------------------------------------|
| draggable     | Boolean            | false      | Enables/disables dragging of pieces and towers                                                    |
|---------------|--------------------|------------|---------------------------------------------------------------------------------------------------|
| dropOffBoard  | 'snapback' or      | 'snapback' | Specifies what happens when a piece/tower is dropped off the board.                               |
|               | 'trash'            |            | If 'snapback', piece/tower moves back to original position.                                       |
|               |                    |            | If 'trash', piece/tower is removed.                                                               |

|---------------|--------------------|------------|---------------------------------------------------------------------------------------------------|
| position      | 'start',           | n/a        |	Sets initial board position.                                                                      |
|               | FEN String or      |            |                                                                                                   |
|               | Position Object    |            |                                                                                                   |
|---------------|--------------------|------------|---------------------------------------------------------------------------------------------------|
| onChange      | Function           | n/a        | Called when board position changes.                                                               |
|               |                    |            | Arguments: old position, new position                                                             |
|---------------|--------------------|------------|---------------------------------------------------------------------------------------------------|
| onDragStart   | Function           | n/a        | Called when piece/tower is picked up.                                                             |
|               |                    |            | Arguments: source, piece/tower, current position, current orientation                             |
|               |                    |            | If this returns false the drag is cancelled.                                                      |
|---------------|--------------------|------------|---------------------------------------------------------------------------------------------------|
| onDragMove    | Function           | n/a        | Called when dragged piece/tower changes location.                                                 |
|               |                    |            | Arguments: new location, old location, source, piece/tower, current position, current orientation |
|---------------|--------------------|------------|---------------------------------------------------------------------------------------------------|
| onDrop        | Function           | n/a        | Called when piece is dropped.                                                                     |
|               |                    |            | Arguments: source, target, piece/tower, new position, old position, current orientation           |
|               |                    |            | If this returns 'snapback', piece/tower moves back to source.                                     |
|               |                    |            | If this returns 'trash', piece/tower is removed.                                                  |
|               |                    |            | !!! The new position argument is currently broken and returns the old position instead !!!        |
|---------------|--------------------|------------|---------------------------------------------------------------------------------------------------|
| onMoveEnd     | Function           | n/a        | Called at the end of a move, when the board position changes.                                     |
|               |                    |            | Arguments: old position, new position                                                             |
|               |                    |            | (Basically the same as onChange, kept for compatability to chessboard.js)                         |
|---------------|--------------------|------------|---------------------------------------------------------------------------------------------------|
| onSnapbackEnd | Function           | n/a        | Called when "snapback" of piece/tower is complete.                                                |
|               |                    |            | Arguments: piece/tower, source, current position, current orientation                             |
|---------------|--------------------|------------|---------------------------------------------------------------------------------------------------|
| onSnapEnd     | Function           | n/a        | Called at the end of a move, when board position changes.                                         |
|               |                    |            | Arguments: source, target, piece/tower                                                            |
|---------------|--------------------|------------|---------------------------------------------------------------------------------------------------|
| orientation   | 'white',           | { x: -10,  | Sets initial board orientation.                                                                   |
|               | 'black' or         |   y: 7,    |                                                                                                   |
|               | Orientation Object |   z: 10 }  |                                                                                                   |
|---------------|--------------------|------------|---------------------------------------------------------------------------------------------------|
| showNotation  | Boolean            | false      | Enable/disable board notation.                                                                    |
|               |                    |            | !!! Not implemented yet. !!!                                                                      |
|---------------|--------------------|------------|---------------------------------------------------------------------------------------------------|
| sparePieces   | Boolean            | false      | Enable/disable spare pieces that can be dragged onto the board.                                   |
|               |                    |            | !!! Not implemented yet. !!!                                                                      |
|---------------|--------------------|------------|---------------------------------------------------------------------------------------------------|
| showErrors    | false, String or   |  n/a       | Choose how errors are reported.                                                                   |
|               | Function           |            | If false, errors are ignored.                                                                     |
|               |                    |            | If 'console', errors output to console.log().                                                     |
|               |                    |            | If 'alert', errors output to window.alert().                                                      |
|               |                    |            | If function, it is called with following arguments: error code, error string, data                |
|               |                    |            | !!! Not implemented yet. !!!                                                                      |
|---------------|--------------------|------------|---------------------------------------------------------------------------------------------------|
| pieceTheme    | String or Function | ''         | Source of piece models.                                                                           |
|               |                    |            | !!! Not implemented yet. !!!                                                                      |
|---------------|--------------------|------------|---------------------------------------------------------------------------------------------------|
| boardTheme    | String or Function | ''         | Source of board models.                                                                           |
|               |                    |            | !!! Not implemented yet. !!!                                                                      |
|---------------|--------------------|------------|---------------------------------------------------------------------------------------------------|

The following [chessboard.js] properties are not implemented:

* onMouseoutSquare
* onMouseoverSquare
* appearSpeed
* moveSpeed
* snapbackSpeed
* snapSpeed
* trashSpeed


## Methods

## Position Object

## FEN String

## Orientation Object

## Errors
