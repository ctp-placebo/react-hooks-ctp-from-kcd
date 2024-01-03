// 4.Take your custom useLocalStorageState hook and make it generic 
// enough to support any data type (remember, you have to serialize 
//   objects to strings... use JSON.stringify and JSON.parse). 
//   Here we make it so the serialize and deserialize can be overridden as options. 

import * as React from 'react'

function useLocalStorageState(key, defaultValue = '', {
  serialize = JSON.stringify, 
  deserialize = JSON.parse
} = {}) {
  const [state, setState] = React.useState(
    () => {
      const valueinLocalStorage = window.localStorage.getItem(key)
      if (valueinLocalStorage) {
        return deserialize(valueinLocalStorage)
      }
      // what of they pass a function as a default value?
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue
    }
  )

  // hypothetical what if the key changes? Say they want to save the name as the surname
  const prevKeyRef = React.useRef(key)

  // GOT 2 HAVE SERIALIZE HERE IN THE DEPENDENCIES ARRAY
  React.useEffect(() => {

    // if the key changes, we need to remove the old key from localStorage
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

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
