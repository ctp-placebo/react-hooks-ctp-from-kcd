// useState: tic tac toe
// *******************************************************************************
// Our customers want to be able to pause a game, close the tab, 
// and then resume the game later. Can you store the game's state in localStorage?

import * as React from 'react'

function Board() {
  // 🐨 squares is the state for this component. Add useState for squares
  const resumeSquares = JSON.parse(window.localStorage.getItem('squares'))
  console.dir(resumeSquares)
  // this only works if useState is a function that returns the initial state: ()=>initialState
  const [squares, setSquares] = React.useState(
    () =>
      resumeSquares || Array(9).fill(null)
  )

  // Notice that before adding this useEffect, my commented out 
  // calls to window.localStorage worked, but I had to manually
  // clear localStorage in the restart function.
  // With useEffect, I can clear localStorage because useEffect 
  // is istening for changes to 'squares'. Sit sets the localStorage back to 
  // an array of nulls. 
  React.useEffect(() => {
    window.localStorage.setItem('squares', JSON.stringify(squares))
  }, [squares])

  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  function selectSquare(square) {
 
    if (squares[square] || winner) {
      return
    }
    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue
    setSquares(squaresCopy)
    // window.localStorage.setItem('squares', JSON.stringify(squaresCopy))
  }

  function restart() {
    setSquares(Array(9).fill(null))
    // window.localStorage.removeItem('squares')
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
