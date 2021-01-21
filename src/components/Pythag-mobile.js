import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Dropdown, FormControl, InputGroup } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import PythagHelper from '../utils/pythag-helper';
//import InfoPanel from './InfoPanel';
import styled from 'styled-components';
import '../css/pythag.css';

const CurrentConfig = styled.span`
  border: 1px solid #999;
  background-color:#eee;
  border-radius: 5px;
  padding:10px; 
`;

const Triple = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: center;
`;

const LayoutToggle = styled.div`
  display: flex;
  justify-content: center;
`;

const Circle = styled.div`
  width: 36px;
  height: 36px;
  margin: 0 8px;
  border-radius: 50%;
  background-color: green;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

const STARTING = 20;
var SQUARE_WIDTH = 21;
var MOVE_DELAY = 500;

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


/*
 * function Pythag, which uses state.
 */
function squarePosition(row, col) {
  var top = (row - 1) * SQUARE_WIDTH, left = (col - 1) * SQUARE_WIDTH;
  return { top, left };
}

function resetASquares(triple) {
	var size = triple.a;
	var totalSquares = size * size;
	for (let i = 0; i < totalSquares; i++) {
		let r = Math.ceil((i + 1) / size), c = (i % size) + 1;
		let pos = squarePosition(r, c);
		let id = `a-${i}`;
		let el = document.querySelector('#' + id);
		el.style.transition = '.5s';
		el.style.top = pos.top + 'px';
		el.style.left = pos.left + 'px';
	}
}


function makeSquares(triple, letter, squareType = '') {
	var size = triple[letter];
	var squares = [];
	let className = 'square';
	if (squareType) className += ' ' + squareType;
	var totalSquares = size * size;
	var offset = letter === 'b' ? triple.c - triple.b : 0;
	var backgroundColor = { a: 'rbga(223, 240, 184, .9)', b: '#dff0b8', c: 'rgba(223, 240, 184, .5)' };

	for (let i = 0; i < totalSquares; i++) {
		let r = Math.ceil((i + 1) / size) + offset, c = (i % size) + 1 + offset;
		let pos = squarePosition(r, c);
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

function getASides(triple) {
  var topWidth = triple.b;
  var topHeight = triple.c - triple.b;
  var totalSquares = triple.c * triple.c;
  var aSides = [];
  for (let i = 0; i < totalSquares; i++) {
    let row = Math.ceil((i + 1) / triple.c), col = (i % triple.c) + 1;
    if (col > triple.a && row <= triple.c - triple.b ||
        col <= triple.c - triple.b && row > triple.a) {
      let moveToRow = Math.ceil((i + 1) / triple.c);
      let moveToCol = (i % triple.c) + 1;
      aSides.push({ row: moveToRow - 1, col: moveToCol - 1 });
    }
  }
return aSides;
}

function moveSquare(id, triple, squareMoved) {
  var aSides = getASides(triple);
  var dest = { top: aSides[squareMoved].row * SQUARE_WIDTH, left: aSides[squareMoved].col * SQUARE_WIDTH };
  var el = document.querySelector('#' + id);
  el.style.transition = '1s';
  el.style.transform = 'rotate(360deg)';
  el.style.top = dest.top + 'px';
  el.style.left = dest.left + 'px';
}

function moveASquares(triple) {
  var aThickness = triple.c - triple.b;
  var squareMoved = 0;
  var totalSquares = triple.a * triple.a;
  var moveFn = [];
  for (let i = 0; i < totalSquares; i++) {
    let r = Math.ceil((i + 1) / triple.a), c = (i % triple.a) + 1;
    if (r > aThickness & c > aThickness) {
      setTimeout( (squareMoved => { 
        return () => { moveSquare('a-' + i, triple, squareMoved) }; 
	  } )(squareMoved), MOVE_DELAY * squareMoved);
      squareMoved++;
    }
    
  }
}

function getPythagData(a) {
  const url = '//arithmo.toewsweb.net:3000/pythag/' + a;
  return fetch(url).then(res => res.json()).then(res => { return res; });
}

function Pythag(props) {
	var [corner, setCorner] = useState(1);
	var [triple, setTriple] = useState({ });
	var [triples, setTriples] = useState([]);
	var [aSquaredConfig, setASquaredConfig] = useState('wraparound');

	SQUARE_WIDTH = Math.max(STARTING - (5*parseInt(triple.c/10,10)) + 1, 5);
  
	useEffect(() => {
		console.log('corner changed', corner);
		processCorner();
	}, [corner]);

	// Need to be clear on exactly when this fires. Look up useEffect, second parameter.
	useEffect(() => {
		var layout = aSquaredConfig === 'wraparound' ? 'square' : 'wraparound';
		console.log('useEffect to call arrangeA,', layout);
		PythagHelper.arrangeA(triple, layout);
	});

	SQUARE_WIDTH = Math.max(STARTING - (5*parseInt(triple.c/10,10)) + 1, 5);
	PythagHelper.setSquareWidth(SQUARE_WIDTH);
  
	PythagHelper.MOVE_DELAY = 500 - (150*parseInt(triple.c/10,10));
	console.log('square width', SQUARE_WIDTH);

	const processCorner = () => {
		if (corner) {
			PythagHelper.getPythagData(corner).then(res => {
				let triple = res[0];
				setTriple({ a: triple.a, b: triple.b, c: triple.c });
				setTriples(res);
			});
		}
	}

	const handleDropdown = e => {
		var el = e.currentTarget;
		setCorner(el.dataset.corner);
	}

	const handleClick = e => {
		e.preventDefault();
		processCorner();
	}

	const handleBlur = e => {
		e.preventDefault();
		var el = e.target;
		setCorner(el.value);
	};

	const handleTripletSelect = e => {
		e.preventDefault();
		var el = e.currentTarget;
		console.log('dataset',el);
		var triple = el.dataset.triple.split(',');
		console.log('triple',triple, triple.length);
		setTriple({ a: triple[0], b: triple[1], c: triple[2] });
	}

  // Mainly added to see that it works. It does!
	function playHandler(e) {
		e.preventDefault();
		var el = e.target;
		setASquaredConfig('wraparound');   
		PythagHelper.arrangeA(triple, 'wraparound');
	}

	const resetHandler = e => {
		e.preventDefault();
		setASquaredConfig('square');   
		PythagHelper.arrangeA(triple, 'square');
	}

	const toggleAHandler = e => {
		e.preventDefault();
		if (aSquaredConfig === 'wraparound') {
			setASquaredConfig('square');   
			PythagHelper.arrangeA(triple, 'square');
		} else {
			setASquaredConfig('wraparound');   
			PythagHelper.arrangeA(triple, 'wraparound');
		}
	}

	const highlightA = () => {
		var aEls = Array.from(document.getElementsByClassName('a-square'));
		aEls.forEach(el => {
			el.classList.add('a-square-on');
			el.classList.remove('a-square');
		});
		setTimeout(() => {
			aEls = Array.from(document.getElementsByClassName('a-square-on'));
			aEls.forEach(el => {
				el.classList.remove('a-square-on');
				el.classList.add('a-square');
			});
		}, 500);
	};

	const highlightB = () => {
		var els = Array.from(document.getElementsByClassName('b-square'));
		els.forEach(el => {
			el.classList.add('b-square-on');
			el.classList.remove('b-square');
		});
		setTimeout(() => {
			els = Array.from(document.getElementsByClassName('b-square-on'));
			els.forEach(el => {
				el.classList.remove('b-square-on');
				el.classList.add('b-square');
			});
		}, 500);
	};

	var cSide = triple.c * SQUARE_WIDTH + 1;
	var squares = PythagHelper.makeSquares(triple, 'c');
	var aSquares = PythagHelper.makeSquares(triple, 'a', 'a-square');
	var bSquares = PythagHelper.makeSquares(triple, 'b', 'b-square');
	var bPositions = [];
	return (
    <div className="Pythagorean-Toy">
      <Container>
        <Row>
          <Col>
            <Triple>
              <Circle onClick={highlightA}>{triple.a}<sup>2</sup></Circle> + <Circle onClick={highlightB}>{triple.b}<sup>2</sup></Circle> = <Circle>{triple.c}<sup>2</sup></Circle>
            </Triple>

            <LayoutToggle><span className="toggle-layout" onClick={toggleAHandler}>Toggle a^2 Layout</span></LayoutToggle>

            { triple.a && (

            <div className="c-squared" style={{ margin: '40px 0', height: cSide + 'px', width: cSide + 'px' }}>
              { squares.map((square, ndx) => {
                  return square;
                }) }
              { bSquares.map((square, ndx) => {
                  let pos = parseInt(square.props.style.top) + '-' + parseInt(square.props.style.left);
                  bPositions.push(pos);
                  return square;
                }) }
              { aSquares.map((square, ndx) => {
                  let pos = parseInt(square.props.style.top) + '-' + parseInt(square.props.style.left);
                  if (bPositions.indexOf(pos) !== -1) {
                      square.props.style.opacity = '.8';
				  }
                  return square;
                }) }
		      <div className="c-label"><PythagHelper.Square type="c" value={triple.c} /></div>
		      <div className="b-label"><PythagHelper.Square type="b" value={triple.b} /></div>
		      <div className="a-label"><PythagHelper.LabelASquared layout={aSquaredConfig} triple={triple} corner={corner} /></div>
            </div> 

			) }
            <InputGroup className="pythag-a">
	  
              <Dropdown>
	          <Dropdown.Toggle size="sm" variant="success" style={{ backgroundColor: "#66866b" }}>
	            Corner size (Currently {corner})
	          </Dropdown.Toggle>

	          <Dropdown.Menu>
	  { [1, 2, 3, 8, 9].map((side, key) => {
	            return <Dropdown.Item key={key} data-corner={side} onClick={handleDropdown}>{side}</Dropdown.Item>
	  }) }
	          </Dropdown.Menu>
{/*	          <InfoPanel id="corner-info" isMobile={true} /> */}
	        </Dropdown>
            </InputGroup>


          </Col>
        </Row>
        <Row>
          <Col>
          { triple.a && (
	        <Table variant="math" bordered hover>
	          <thead>
	            <tr>
	              <th>Triple</th>
	              <th>a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup></th>
	              <th>Primitive</th>
	            </tr>
	          </thead>
	          <tbody>
	            {triples.map((t, key) => (
	            <tr key={key} onClick={handleTripletSelect} data-triple={`${t.a},${t.b},${t.c}`}>
	              <td>({t.a}, {t.b}, {t.c})</td>
	              <td>{t.a*t.a} + {t.b*t.b} = {t.c*t.c}</td>
	              <td>{t.isPrimitive?'Yes':'No'}</td>
	            </tr>
                ))}
	          </tbody>
	        </Table>
          ) }
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Pythag
