import { useEffect, useState } from "react";

function checkWinner(cellData) {
  const checkSeq = [
    [[0, 0], [0, 1], [0, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[1, 0], [1, 1], [1, 2]],
    [[0, 1], [1, 1], [2, 1]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
  ];
  for (let x = 0; x < checkSeq.length; x++) {
    const seq = checkSeq[x];
    let win = true;
    for (let i = 1; i < seq.length; i++) {
      const cur = seq[i];
      const pre = seq[i - 1]
      if (cellData[cur[0]][cur[1]] == null || cellData[cur[0]][cur[1]] != cellData[pre[0]][pre[1]]) {
        win = false;
        break;
      }
    }
    if (win) {
      return cellData[seq[0][0]][seq[0][1]];
    }
  }
  return isDraw(cellData) ? 'DRAW' : null;
}

function isDraw(cellData) {
  return cellData.every(row => row.every(cell => cell != null));
}

export default function Game() {
  // const [curPlayer, setCurPlayer] = useState('X');
  const [cellData, setCellData] = useState(
    [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]
  );
  const [history, setHistory] = useState([cellData.slice()]);
  const [curMove, setCurMove] = useState(0);

  function onPlay(newCellData, nextPlayer) {
    setCellData(newCellData);
    let nextHistory = history.slice(0, curMove + 1);
    nextHistory.push(newCellData);
    setHistory(nextHistory);
    setCurMove(curMove + 1);
  }

  function jumpTo(i) {
    setCurMove(i);
    setCellData(history[i]);
  }

  const curPlayer = curMove % 2 == 0 ? 'X' : 'O';

  return (
    <>
      <Board cellData={cellData} onPlay={onPlay} curPlayer={curPlayer} />
      {history.map((record, i) => {
        if (i == 0)
          return <button key={i} onClick={() => jumpTo(i)}>Game Start</button>
        return <button key={i} onClick={() => jumpTo(i)}>Move {i}</button>
      })}
    </>
  );
}

function Board({
  cellData,
  curPlayer,
  onPlay,
}) {
  const handleOnClick = (i, j) => {
    if (checkWinner(cellData)) return;

    const newCellData = cellData.map(row => row.slice());
    let nextPlayer = curPlayer;
    if (newCellData[i][j] == null) {
      newCellData[i][j] = curPlayer;
      nextPlayer = curPlayer == 'X' ? 'O' : 'X';
    }
    onPlay(newCellData, nextPlayer);
  }

  const cells = cellData.map((row, i) => {
    return (
      <div className="row" key={i}>
        {row.map((cell, j) => {
          return (
            <Cell
              key={"" + i + j}
              value={cell}
              onClick={() => handleOnClick(i, j)}
            />)
        })}
      </div>
    )
  });

  const winner = checkWinner(cellData);
  let status = 'Current Player: ' + curPlayer;
  if (winner == 'DRAW') {
    status = 'Game End: Draw';
  } else if (winner) {
    status = 'The winner is: ' + winner;
  }

  return (
    <>
      <div className="row">{status}</div>
      {cells}
    </>
  );
}

function Cell({ value, onClick }) {
  return <button className="cell" onClick={onClick}>{value}</button>;
}

