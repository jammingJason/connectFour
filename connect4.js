/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
	// TODO: set "board" to empty HEIGHT x WIDTH matrix array
	let newArr = [];
	for (let x = 0; x < HEIGHT; x++) {
		for (let i = 0; i < WIDTH; i++) {
			newArr.push(null);
		}
		board.push(newArr);
		newArr = [];
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
	const htmlBoard = document.querySelector('#board');
	// TODO: add comment for this code
	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// TODO: add comment for this code
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			// cell.setAttribute('backgroundColor', 'white');
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	// TODO: write the real version of this, rather than always returning 0
	// console.log(x);
	for (let i = 0; i < HEIGHT; i++) {
		if (board[i][x] !== null) {
			if (i - 1 === -1) {
				return null;
			}
			return i - 1;
		}
	}
	return 5;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	// TODO: make a div and insert into correct table cell
	const tableCell = document.getElementById(y + '-' + x);
	let newDiv = document.createElement('div');
	newDiv.className = 'piece';
	//  Changes color based on current player
	if (currPlayer === 1) {
		newDiv.style.backgroundColor = 'red';
	} else {
		newDiv.style.backgroundColor = 'blue';
	}
	newDiv.style.top = '0px';
	tableCell.append(newDiv);
}

/** endGame: announce game end */
function endGame(msg) {
	// TODO: pop up alert message
	const getPlayer = document.getElementById('board');
	const winAlert = document.createElement('div');
	getPlayer.append(winAlert);
	winAlert.style.position = 'absolute';
	winAlert.style.top = '25px';
	winAlert.id = 'alert';
	winAlert.innerText = msg;
	winAlert.style.fontSize = '2rem';
	setTimeout(clearBoard, 2000);
	player.innerText = 'Turn : Player 1';
	player.style.color = 'red';
}
const clearBoard = () => {
	// let getParDiv = document.getElementById('game');
	const alertMsg = document.getElementById('alert');
	alertMsg.innerText = '';
	currPlayer = 1;
	let getDiv = document.querySelectorAll('.piece');
	for (const iterator of getDiv) {
		iterator.remove();
	}
	board = [];
	makeBoard();
	makeDiv('red');
	document.getElementById('board').style.pointerEvents = 'auto';
};
/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
	// get x from ID of clicked cell
	let x = +evt.target.id;
	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}
	// place piece in board and add to HTML table
	// TODO: add line to update in-memory board
	board[y][x] = currPlayer;

	placeInTable(y, x);
	// check for win
	if (checkForWin()) {
		document.getElementById('board').style.pointerEvents = 'none';
		return endGame(`Player ${currPlayer} won!`);
	}
	// check for tie
	let strPieces = '';
	for (const pieces of board) {
		for (const piece of pieces) {
			strPieces += piece;
		}
		if (!strPieces.includes('null')) {
			endGame('The game has tied');
			return;
		}
	}
	// switch players
	// () => (currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1));
	let player = document.querySelector('#player');
	if (currPlayer === 1) {
		currPlayer = 2;
		player.innerText = 'Turn : Player 2 ';
		player.style.color = 'blue';
		makeDiv('blue');
	} else {
		currPlayer = 1;
		player.innerText = 'Turn : Player 1 ';
		player.style.color = 'red';
		makeDiv('red');
	}
}

function makeDiv(color) {
	const getPlayer = document.getElementById('player');
	const getDiv = document.createElement('div');
	getPlayer.append(getDiv);
	getDiv.style.width = '25px';
	getDiv.style.height = '25px';
	getDiv.style.borderRadius = '100%';
	getDiv.style.backgroundColor = color;
	getDiv.style.marginLeft = '12px';
}
/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer
		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}
	// TODO: read and understand this code. Add comments to help you.
	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];
			if (_win(horiz)) {
				setTimeout(flashSpaces, 1000, horiz);
			}
			if (_win(vert)) {
				setTimeout(flashSpaces, 1000, vert);
			}
			if (_win(diagDR)) {
				setTimeout(flashSpaces, 1000, diagDR);
			}
			if (_win(diagDL)) {
				setTimeout(flashSpaces, 1000, diagDL);
			}
			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}
makeDiv('red');
makeBoard();
makeHtmlBoard();

function flashSpaces(strSpaces) {
	let strWinning = strSpaces.toString();

	// let str1 = '';
	// let str2 = '';
	// let str3 = '';
	// let str4 = '';
	for (let i = 0; i < strWinning.length; i++) {
		strWinning = strWinning.replace(',', '');
	}
	const str1 = strWinning[0] + '-' + strWinning[1];
	const str2 = strWinning[2] + '-' + strWinning[3];
	const str3 = strWinning[4] + '-' + strWinning[5];
	const str4 = strWinning[6] + '-' + strWinning[7];

	const winningPlace1 = document.getElementById(str1);
	winningPlace1.className = 'winPlace';
	const winningPlace2 = document.getElementById(str2);
	winningPlace2.className = 'winPlace';
	const winningPlace3 = document.getElementById(str3);
	winningPlace3.className = 'winPlace';
	const winningPlace4 = document.getElementById(str4);
	winningPlace4.className = 'winPlace';
	mainColor();
	let intColor = 0;
	//  Changes the background color to the winning player.  Player 1 is red and 2 is blue
	function mainColor() {
		const getWinPlaces = document.querySelectorAll('.winPlace');
		if (currPlayer === 1) {
			for (const winPlaces of getWinPlaces) {
				winPlaces.style.backgroundColor = 'red';
			}
			setTimeout(whiteColor, 100);
		} else {
			for (const winPlaces of getWinPlaces) {
				winPlaces.style.backgroundColor = 'blue';
			}
			setTimeout(whiteColor, 100);
		}
	}
	function whiteColor() {
		const getWinPlaces = document.querySelectorAll('.winPlace');
		for (const winPlaces of getWinPlaces) {
			winPlaces.style.backgroundColor = 'white';
		}
		if (intColor < 3) {
			setTimeout(mainColor, 100);
			intColor++;
		}
	}
}
