// Init
var scene = new THREE.Scene();

var width = window.innerWidth;
var height = window.innerHeight;
var camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
camera.position.set(-10, 7, 10);
var mouseMain = new THREE.Vector2();

var renderer = new THREE.WebGLRenderer( {antialias: true} );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.setClearColor(0xafafaf, 1);
document.body.appendChild(renderer.domElement);

//var objects = [];

var axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// Controls
var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
orbitControls.minDistance = 2;
orbitControls.maxDistance = 100;
orbitControls.enablePan = false;
orbitControls.zoomSpeed = 1.0;
orbitControls.rotateSpeed = 1.0;
orbitControls.minPolarAngle = 0;
orbitControls.maxPolarAngle = Math.PI;

//var dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
//dragControls.addEventListener('dragstart', function() {
//	orbitControls.enabled = false;
//});
//dragControls.addEventListener('dragend', function() {
//	orbitControls.enabled = true;
//});

var raycaster = new THREE.Raycaster();
var selectable = [];


// ----------------------------------------------------------------
// ----------------------------------------------------------------
// Setup
// ----------------------------------------------------------------
// ----------------------------------------------------------------

function posToVector3(pos) {

	return new THREE.Vector3(pos.r, pos.l * 2, pos.f );

}

// Tridchess
var tridchess = new Tridchess();


// ----------------------------------------------------------------
// Square Indicators
// ----------------------------------------------------------------

var indGeo = new THREE.PlaneGeometry();
indGeo.translate(0, 0, 0.01); // Set origin below square
var indMat= new THREE.MeshBasicMaterial( {color: 0xfafcb8,
										  side: THREE.DoubleSide} );


// ----------------------------------------------------------------
// Main Board
// ----------------------------------------------------------------

var board = new THREE.Group();
board.position.set(-4.5, -4, -2.5); // Center board on origin

scene.add(board);

// Add board model
var boardGeo = new THREE.BoxGeometry();
boardGeo.translate(0, -0.5, 0); // Set origin at top
var boardMat = new THREE.MeshBasicMaterial( {color: 0x92b4ce} );

var boardMod = new THREE.Mesh(boardGeo, boardMat);
boardMod.position.set(4.5, 4, 2.5);

board.add(boardMod);

// Add squares
for (var square = 0; square < 48; square++) {
	
	// Get position
	var pos = MAIN_SQUARES[square];
	vec = posToVector3(pos); 	
	
	var squGroup = new THREE.Group();
	squGroup.name = 'abcdef'.charAt(pos.f) + (pos.r + 1) + '_' + (pos.l + 1);
	squGroup.userData = pos;

	// Place square indicator
	var ind = new THREE.Mesh(indGeo, indMat);

	ind.position.set(vec.x, vec.y, vec.z);
	ind.rotateX(-Math.PI / 2); // Rotate upright

	squGroup.add(ind);
	board.add(squGroup);

	selectable.push(squGroup); // DEBUG
}


// ----------------------------------------------------------------
// Towers
// ----------------------------------------------------------------

var towGeo = new THREE.BoxGeometry(0.25, 2, 0.25);
towGeo.translate(0, -1, 0); // Set origin at top
var towMat = new THREE.MeshBasicMaterial( {color: 0xff000} );

// Add Towers
var towers = new THREE.Group();

for (var tower = 0; tower < 12; tower++) { 

	var towGroup = new THREE.Group();
	towGroup.name = 'T' + (tower+1);

	var vec;

	for (var square = 0; square < 4; square++) {

		// Get position
		var pos = TOWER_SQUARES[tower][square];
		vec = posToVector3(pos); 	
		
		var squGroup = new THREE.Group();
		squGroup.name = 'abcdef'.charAt(pos.f) + (pos.r + 1) + '_' + (pos.l + 1);
		squGroup.userData = pos;

		// Place square indicator
		var ind = new THREE.Mesh(indGeo, indMat);

		ind.position.set(vec.x, vec.y, vec.z);
		ind.rotateX(-Math.PI / 2); // Rotate upright

		squGroup.add(ind);
		towGroup.add(squGroup);

	}

	// Add offset from square to center of tower
	vec = vec.add( new THREE.Vector3(-0.5, 0, -0.5) ); 

	// Place tower
	var tow = new THREE.Mesh(towGeo, towMat);

	tow.position.set(vec.x, vec.y, vec.z);

	towGroup.add(tow);
	towers.add(towGroup);

	selectable.push(towGroup); // DEBUG
}

board.add(towers);


// ----------------------------------------------------------------
// Pieces
// ----------------------------------------------------------------

var pieces = [];
var pieHeight = 1.25;

function pieGeo(height) {

	var pieGeo = new THREE.BoxGeometry(0.5, height, 0.5);
	pieGeo.translate(0, height / 2, 0); // Set Origin at bottom

	return pieGeo;

}

var pieMatWhite = new THREE.MeshBasicMaterial( {color: 0xededed} );
var pieMatBlack = new THREE.MeshBasicMaterial( {color: 0x0c0c0c} );

// Pieces: Pawn, Knight, Bishop, Rook, Queen, King
// White: uppercase, Black: lowercase
var pieModels = {

	P: new THREE.Mesh(pieGeo(0.6), pieMatWhite),
	N: new THREE.Mesh(pieGeo(0.9), pieMatWhite),
	B: new THREE.Mesh(pieGeo(1), pieMatWhite),
	R: new THREE.Mesh(pieGeo(0.8), pieMatWhite), 
	Q: new THREE.Mesh(pieGeo(1.2), pieMatWhite), 
	K: new THREE.Mesh(pieGeo(1.25), pieMatWhite),
	p: new THREE.Mesh(pieGeo(0.6), pieMatBlack),
	n: new THREE.Mesh(pieGeo(0.9), pieMatBlack),
	b: new THREE.Mesh(pieGeo(1), pieMatBlack),
	r: new THREE.Mesh(pieGeo(0.8), pieMatBlack), 
	q: new THREE.Mesh(pieGeo(1.2), pieMatBlack), 
	k: new THREE.Mesh(pieGeo(1.25), pieMatBlack) 

};


// ----------------------------------------------------------------
// ----------------------------------------------------------------
// Update
// ----------------------------------------------------------------
// ----------------------------------------------------------------

function updateBoard() {

	// Get tower and piece positions
	var towArr = tridchess.getTowers();
	var boardArr = tridchess.getBoard();

	// Deactivate all towers
	for (var i = 0; i < towers.children.length; i++) {

		towers.children[i].visible = false;

	}

	// TODO: Make all towers unselectable

	// Activate placed towers
	for (var i = 0; i < towArr.length; i++) {

		var towPos = towArr[i];
		var tower = towers.getObjectByName('T' + towPos);

		tower.visible = true;

		// TODO: Make selectable

	}

	// Delete all pieces
	for (var i = 0; i < pieces.length; i++) {

		console.log("Deleted " + pieces[i].parent.name);
		pieces[i].parent.remove(pieces[i]);

	}

	// Place pieces
	pieces = [];
	console.log(pieces); // DEBUG

	for (var f = 0; f < boardArr.length; f++) {
		for (var r = 0; r < boardArr[f].length; r++) {
			for (var l = 0; l < boardArr[f][r].length; l++) {

				var pieType = boardArr[f][r][l];

				if (pieType !== null && pieType !== ' ') {

					// Get position as Pos, vector and string (fr_l)
					var pos = new Pos(f, r, l);
					var vec = posToVector3(pos);
					var sPos = 'abcdef'.charAt(pos.f) + (pos.r + 1) + '_' + (pos.l + 1);

					// Place appropriate piece model
					var piece = pieModels[pieType].clone();

					piece.position.set(vec.x, vec.y, vec.z);

					// Add piece to square
					var squ = board.getObjectByName(sPos, true);
					squ.add(piece);

					// Add piece to pieces array
					pieces.push(piece);

				}

			}
		}
	}

}

updateBoard();

// DEBUG
tridchess.placePiece('p', new Pos(1,1,0));
//updateBoard();
tridchess.moveTower(1,5);
//updateBoard();
tridchess.placePiece('P', new Pos(3,3,2));
tridchess.moveTower(2,4);
updateBoard();


function onDocumentMouseMove(event) { 
	event.preventDefault();
	console.log("MouseMove");

	mouseMain.x = (event.clientX /renderer.domElement.clientWidth) * 2 -1;
	mouseMain.y = -(event.clientY /renderer.domElement.clientHeight) * 2 +1;

}

renderer.domElement.addEventListener('mousemove', onDocumentMouseMove);


var selected = null;

function onDocumentMouseDown(event) {

	event.preventDefault();
	console.log("MouseDown");

	if (selected !== null) {
		selected.visible = true;
		selected = null;
		console.log("Make visible");
	}

	raycaster.setFromCamera(mouseMain, camera);
	var intersects = raycaster.intersectObjects(selectable, true);
	if (intersects.length > 0) {
		selected = intersects[0].object.parent;
		selected.visible = false;

		//var index = selectable.indexOf(selected);
		//if (index !== -1) {
		//	selectable.splice(index, 1); // NOT FOUND REMOVES LAST ELEMENT
		//}

		console.log("Selected " + selected.name);
		console.log(selectable);
	}
	
}

renderer.domElement.addEventListener('mousedown', onDocumentMouseDown);


// Window Resizing
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

window.addEventListener('resize', onWindowResize, false);


// Animation loop
function animate() {

	requestAnimationFrame(animate);
	renderer.render(scene, camera);

}

animate();


