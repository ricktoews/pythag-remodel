import React from 'react';

var SQUARE_WIDTH = 21;
var MOVE_DELAY = 500;
var squarePositions = {};

function getWraparoundPos(triple) {
	var topWidth = triple.b;
	var topHeight = triple.c - triple.b;
	var totalSquares = triple.c * triple.c;
	var wraparound = [];
	for (let i = 0; i < totalSquares; i++) {
		let row = Math.ceil((i + 1) / triple.c), col = (i % triple.c) + 1;
		if (row <= triple.c - triple.b || col <= triple.c - triple.b) {
			let wraparoundR = Math.ceil((i + 1) / triple.c);
			let wraparoundC = (i % triple.c) + 1;
			wraparound.push({ r: wraparoundR, c: wraparoundC });
		}
	}
	return wraparound;
}

function getSquarePos(triple) {
	var squarePos = {};
	var className = 'square';
	for (let letter in triple) {
		let squareType = letter === 'c' ? '' : `${letter}-square`;
		let side = triple[letter];
		let totalSquares = side * side;
		let offset = letter === 'b' ? triple.c - triple.b : 0;
		squarePos[letter] = {square: [], wraparound: []};
		if (squareType) { className += ' ' + squareType; }
		let squares = [];
		for (let i = 0; i < totalSquares; i++) {
			let squareR = Math.ceil((i + 1) / side) + offset, squareC = (i % side) + 1 + offset;
			squares.push({r: squareR, c: squareC});
		}
		squarePos[letter].square = squares;
		if (letter === 'a') {
			squarePos.a.wraparound = getWraparoundPos(triple);
		}
	}

	return squarePos;
}



function setSquareWidth(w) {
	SQUARE_WIDTH = w;
}

function squareCSSPosition(row, col) {
	var top = (row - 1) * SQUARE_WIDTH, left = (col - 1) * SQUARE_WIDTH;
	return { top, left };
}


function layoutSquare(triple) {
	var side = triple.a;
	var totalSquares = side * side;
	for (let i = 0; i < totalSquares; i++) {
		let r = Math.ceil((i + 1) / side), c = (i % side) + 1;
		let pos = squareCSSPosition(r, c);
		let id = `a-${i}`;
		let el = document.querySelector('#' + id);
		el.style.transition = '.5s';
		el.style.top = pos.top + 'px';
		el.style.left = pos.left + 'px';
	}
}


/*
function getASides(triple) {
	var topWidth = triple.b;
	var topHeight = triple.c - triple.b;
	var totalSquares = triple.c * triple.c;
	var aSides = [];
	for (let i = 0; i < totalSquares; i++) {
		let row = Math.ceil((i + 1) / triple.c), col = (i % triple.c) + 1;
		if (col > triple.a && row <= triple.c - triple.b || col <= triple.c - triple.b && row > triple.a) {
			let moveToRow = Math.ceil((i + 1) / triple.c);
			let moveToCol = (i % triple.c) + 1;
			aSides.push({ row: moveToRow - 1, col: moveToCol - 1, posOnly: (col > triple.a || row > triple.a) });
		}
	}
	return aSides;
}


function wraparoundPosition(triple, squareMoved) {
	var aSides = getASides(triple);
	var top = aSides[squareMoved].row * SQUARE_WIDTH;
	var left =aSides[squareMoved].col * SQUARE_WIDTH;
	return { top, left };
}


function moveSquare(id, triple, squareMoved) {
	var dest = wraparoundPosition(triple, squareMoved);
	var el = document.querySelector('#' + id);
	el.style.transition = '1s';
	el.style.transform = 'rotate(360deg)';
	el.style.top = dest.top + 'px';
	el.style.left = dest.left + 'px';
}
*/


function layoutWrapAround(triple) {
	var aThickness = triple.c - triple.b;
	var squareMoved = 0;
	var totalSquares = triple.a * triple.a;
	var moveFn = [];
	for (let i = 0; i < totalSquares; i++) {
		let { r, c } = squarePositions.a.wraparound[i];
		var dest = squareCSSPosition(r, c);
		var el = document.querySelector('#a-' + i);
		el.style.transition = '1s';
		el.style.transform = 'rotate(360deg)';
		el.style.top = dest.top + 'px';
		el.style.left = dest.left + 'px';
	}
}

var count = 0;
function makeSquares(triple, letter, squareType = '') {
	squarePositions = getSquarePos(triple);

	var side = triple[letter];
	var squares = [];
	let className = 'square';
	if (squareType) { className += ' ' + squareType; }
	var totalSquares = side * side;
	var offset = letter === 'b' ? triple.c - triple.b : 0;
	for (let i = 0; i < totalSquares; i++) {
		let {r, c} = letter === 'a' ? squarePositions[letter].wraparound[i] : squarePositions[letter].square[i];
		let pos = squareCSSPosition(r, c);
		let id = `${letter}-${i}`;
		squares.push(<div id={id} key={i} className={ className } style={{ 
			top: pos.top + 'px', 
			left: pos.left + 'px',
			width: (SQUARE_WIDTH - 1) + 'px',
			height: (SQUARE_WIDTH - 1) + 'px',
		}}></div>);
	}

	return squares;
}


function arrangeA(triple, layout) {
	console.log('got arrangeA', layout);
	if (layout === 'square') {
		layoutSquare(triple);
	} else if (layout === 'wraparound') {
		layoutWrapAround(triple);
	}
}


function LabelASquared(props) {
	var { layout, triple, corner } = props;
    var desc = layout === 'wraparound' 
		? (<div>a<span>2</span> = {triple.a} x {triple.a}</div>) 
		: (<div>a<span>2</span> = {corner}<span>2</span> + {corner}x{triple.b} + {corner}x{triple.b}</div>)
	return (
    <div style={{ position: 'relative' }}>
      <div className="square a-square" style={{
      display: 'none',
      width: (SQUARE_WIDTH - 1) + 'px',
      height: (SQUARE_WIDTH - 1) + 'px',
      border: '1px solid black'
    }}></div>
      {desc}
    </div>
	);
}

function Square(props) {
	var className = 'square';
	if (props.type === 'a') { className += ' a-square'; }
	else if (props.type === 'b') { className += ' b-square'; }
	return (
    <div style={{ position: 'relative' }}>
      <div className={ className } style={{
      display: 'none',
      width: (SQUARE_WIDTH - 1) + 'px',
      height: (SQUARE_WIDTH - 1) + 'px',
      border: '1px solid black'
    }}></div>
      <div>{props.type}<span>2</span> = {props.value} x {props.value} ({props.value*props.value})</div>
    </div>
	);
}

function getPythagData(a) {
	const url = 'https://arithmo.toewsweb.net:3000/pythag/' + a;
	return fetch(url).then(res => res.json()).then(res => { return res; });
}

const PythagHelper = {
	getPythagData,
	setSquareWidth,
	Square,
	LabelASquared,
	makeSquares,
	arrangeA,
	SQUARE_WIDTH,
	MOVE_DELAY
};

export default PythagHelper;
