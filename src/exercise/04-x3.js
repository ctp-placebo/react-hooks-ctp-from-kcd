// useState: tic tac toe
// *******************************************************************************
// add game history feature (steps in a game, not history of previously played games)

// This involved a massive reformatting of the code, moving almost everything that 
// had been in the Board function over to the Game function. 

import * as React from 'react'
import {useLocalStorageState} from '../utils'

// Badly named onClick, it's user defined not the built in onClick method!
function Board({squares, onClick}) {
  
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
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
    </div>
  )
}

/**
 * A React component that renders a game of naughts and crosses (tic-tac-toe).
 * @returns {JSX.Element} The React component.
 */
function Game() {

  // creates a localstorage entry for the history, an array of arrays.
  // see setHistory below for how it is used.
  const [history, setHistory] = useLocalStorageState(
    'naughts-and-crosses:history', [Array(9).fill(null)
  ])

  // creates a new localStorage entry for the currentStep, an integer. 
  // see setCurrentStep below for how it is used.
  const [currentStep, setCurrentStep] = useLocalStorageState(
    'naughts-and-crosses:step', 0
  )

  const currentSquares = history[currentStep]
  const winner = calculateWinner(currentSquares)
  const nextValue = calculateNextValue(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  /**
   * A function that is called when a square on the board is clicked.
   * If the square is already filled or there is a winner, the function does nothing.
   * Otherwise, it updates the history and currentStep in localStorage with the new square value.
   * @param {number} square - The index of the square that was clicked.
   */
  function selectSquare(square) {      
    if (currentSquares[square] || winner) {
      return
    }
  
    const newHistory = history.slice(0, currentStep + 1)
    console.log('newHistory: ', newHistory)
    const squares = [...currentSquares]
    
    squares[square] = nextValue
    setHistory([...newHistory, squares])
    setCurrentStep(newHistory.length)
  }

  /**
   * A function that restarts the game by resetting the history and currentStep 
   * in localStorage.
   */
  function restart() {
    setHistory([Array(9).fill(null)])
    setCurrentStep(0)
  }

  const moves = history.map((stepSquares, step) => {
    const desc = step === 0 ? 'Go to game start' : `Go to move #${step}`
    const isCurrentStep = step === currentStep
    return (
      <li key={step}>
        <button disabled={isCurrentStep} onClick={() => setCurrentStep(step)}>
          {desc} {isCurrentStep ? '(current)' : null}
        </button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          ! RESTART !
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
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
