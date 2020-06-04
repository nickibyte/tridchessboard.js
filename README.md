# tridchessboard.js

tridchessboard.js is a JavaScript implementation of a Tri-Dimensional chessboard (from the StarTrek TV-series).

It depends on the [three.js] library and is heavily inspired by [chessboard.js] (its couterpart for regular chess).


## What does it do?

tridchessboard.js does exactly what a physical Tri-D chessboard can do. Nothing more, nothing less.

That means you can:

* View the board from any angle
* Move/capture pieces and tower-boards
* Play by whichever set of rules you'd like

Additionally it provides an extensive API (modeled after that of [chessboard.js]).
Which is great because this means you can easily use most of the numerous examples that exist for [chessboard.js].


## What does it not do?

tridchessboard.js does not:

* Know anything about the rules of Tri-D chess
* Do any move validation
* Keep track of who's turn it is
* etc.

Functionality like this is best implemented seperately from the board.
You can use tridchessboard.js's API to connect it to other parts of your software.


## Quick start

Adding tridchessboard.js to your site is really simple:

Just copy [tridchessboard.min.js](build/tridchessboard.min.js) to the js/ directory.

The following code then adds a new Tri-D chessboard to the 'chessboard' div, sets up the default starting position and enables dragging of pieces and towers.
Ready for play.

~~~html
<!DOCTYPE html>
<html>
	<body>

		<div id="chessboard"></div>

		<script src="js/tridchessboard.min.js"></script>

		<script>
			var config = { draggable: true, position: 'start' };

			var board = Tridchessboard( 'chessboard', config );
		</script>

	</body>
</html>
~~~

For further instruction on configuring the Tri-D chessboard and using the API, please see the [Docs and Examples](#docs-and-examples).


## Docs and Examples

* [Docs]
* [Examples]
* My own implementation


## TODO

* [ ] Add spare pieces
* [ ] Add notation to board
* [ ] Proper build and test scripts (using node.js?)


## License

tridchessboard.js is licensed under the [LGPLv3](COPYING.LESSER).

That means you may use it in your own (even proprietary) software.
But if you change it you are required to release your modified version under this same license or the [GPLv3](COPYING).


[chessboard.js]: https://github.com/oakmac/chessboardjs
[three.js]: https://github.com/mrdoob/three.js
[Docs]:
[Examples]:
