// 3. The best part of hooks is that if you find a bit of logic inside your component function 
// that you think would be useful elsewhere, you can put that in another function and call 
// it from the components that need it (just like regular JavaScript). These functions 
// you create are called "custom hooks".
// Create a custom hook called useLocalStorageState for reusability of all this logic.

// flexible localStorage hook
// Take your custom useLocalStorageState hook and make it generic enough to support 
// any data type (remember, you have to serialize objects to strings... use 
//   JSON.stringify and JSON.parse). Go wild with this!

import * as React from 'react'

function useLocalStorageState(key, defaultValue = '') {
  const [state, setState] = React.useState(
    () => {
      const valueinLocalStorage = window.localStorage.getItem(key)
      if (valueinLocalStorage) {
        return JSON.parse(valueinLocalStorage)
      }
      return defaultValue
    }
  )

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}

function Greeting({ initialName = '' }) {

  const [name, setName] = useLocalStorageState('name', initialName)
  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="" />
}

export default App
