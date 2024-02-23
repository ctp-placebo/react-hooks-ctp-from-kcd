import * as React from 'react'

import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    // if the pokemonName is falsy then don't make the request (exit early).
    if (!pokemonName) {
      return
    }
    // before calling `fetchPokemon`, clear the current pokemon state by setting it to null
    setPokemon(null)
    // Use the `fetchPokemon` function to fetch a pokemon
    fetchPokemon(pokemonName).then(
      pokemon => setPokemon(pokemon),
      error => setError(error),
      )
  }, [pokemonName])

  if (error) {
    return (
      <div role="alert">
        There was an error: <pre style={{whiteSpace: 'normal', color: '#ffffff', backgroundColor: '#ff0000'}}>{error.message}</pre>
      </div>
    )
  }


  if (!pokemonName) {
    return 'Submit a pokemon'
  } else if (!pokemon) {
    return <PokemonInfoFallback name={pokemonName} />
  } else {
    return <PokemonDataView pokemon={pokemon} />
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
