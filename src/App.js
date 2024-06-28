import { useState } from "react";

function BoardRow({ squares }) {
  return <div className="board-row">{squares}</div>;
}

function Square({ value, onSquareClick, winner }) {
  return (
    <button
      className={"square" + (winner ? " winner" : "")}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, currentMove, onPlay }) {
  const [winner, winnerCells] = calculateWinner(squares);

  let status;
  if (winner) {
    status = `Winner: ${winner}!`;
  } else if (squares.length == 9 && currentMove == 9) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  function handleClick(i) {
    if (winner || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const rowSquares = [];

    for (let col = 0; col < 3; col++) {
      const square = col + row * 3;
      rowSquares.push(
        <Square
          key={`s${square}`}
          value={squares[square]}
          onSquareClick={() => handleClick(square)}
          winner={winnerCells?.includes(square)}
        />
      );
    }

    boardRows.push(
      <BoardRow key={`row${row}`}
        squares={rowSquares}
      />
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [moveListAsc, setMoveListAsc] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_, move) => {
    let item;

    if (move == currentMove) {
      item = `You are at move #${move}`
    } else {
      let description;

      if (move > 0) {
        description = `Go to move #${move}`
      } else {
        description = "Go to game start"
      }
      item = <button onClick={() => jumpTo(move)}>{description}</button>
    }

    return <li key={move}>{item}</li>;
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} currentMove={currentMove} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div style={{textAlign: "center"}}>
          <button onClick={() => setMoveListAsc(!moveListAsc)}>
            Ordering: {moveListAsc ? <b>/\</b> : <b>\/</b>}
          </button>
        </div>
        <ol
          start={moveListAsc ? "0" : moves.length - 1}
          reversed={moveListAsc ? "" : "reversed"}
        >
          {moveListAsc ? moves : moves.reverse()}
        </ol>
      </div>
    </div >
  );
}

function calculateWinner(squares) {
  const cells = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < cells.length; i++) {
    const [a, b, c] = cells[i];
    const notNull = squares[a];
    const pairB = squares[a] === squares[b];
    const pairC = squares[a] === squares[c];
    if (notNull && pairB && pairC) return [notNull, cells[i]];
  }
  return [null, null];
}
