import { useState } from "react";

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
  return null;
}

export default function Game() {
  const [curPlayer, setCurPlayer] = useState('X');
  const [cellData, setCellData] = useState(
    [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]
  );
  // manage history

  const onPlay = (newCellData, nextPlayer) => {
    setCellData(newCellData);
    setCurPlayer(nextPlayer);
  }

  return (
    <Board cellData={cellData} onPlay={onPlay} curPlayer={curPlayer} />
  );
}

function Board({
  cellData,
  curPlayer,
  onPlay,
}) {
  const [winner, setWinner] = useState(checkWinner(cellData));

  const handleOnClick = (i, j) => {
    if (winner != null) return;

    const newCellData = cellData.map(row => row.slice());
    let nextPlayer = curPlayer;
    if (newCellData[i][j] == null) {
      newCellData[i][j] = curPlayer;
      nextPlayer = curPlayer == 'X' ? 'O' : 'X';
    }
    setWinner(checkWinner(newCellData));
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

  return (
    <>
      {winner && (<div className="row">winner is : {winner}</div>)}
      {cells}
    </>
  );
}

function Cell({ value, onClick }) {
  return <button className="cell" onClick={onClick}>{value}</button>;
}

