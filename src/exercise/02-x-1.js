// useEffect: persistent state

// Right now, every time our component function is run, our function reads from localStorage. 
// This is problematic because it could be a performance bottleneck (reading from localStorage can be slow). 
// And what's more we only actually need to know the value from localStorage the first time this component 
// is rendered! So the additional reads are wasted effort.
// To avoid this problem, React's useState hook allows you to pass a function instead of the actual 
// value, and then it will only call that function to get the state value when the component is rendered 
// the first time. So you can go from this: 
// React.useState(someExpensiveComputation()) To this: React.useState(() => someExpensiveComputation())

// And the someExpensiveComputation function will only be called when it's needed!

// Make the React.useState call use lazy initialization to avoid a performance bottleneck of reading 
// into localStorage on every render

import * as React from 'react'

function Greeting({initialName = ''}) {

  // Solution; I had already done this by mistake in the previous exercise
  const [name, setName] = React.useState(
    () => window.localStorage.getItem('name') ?? initialName
  ) 

  React.useEffect(() => {
    window.localStorage.setItem('name', name)
  }, [name])
  
  // see notes, the dependencies arrya `[name]` is extra 2. Adding this 2nd arg to the useEffect 
  // function means the function will only be called when the name changes.


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
