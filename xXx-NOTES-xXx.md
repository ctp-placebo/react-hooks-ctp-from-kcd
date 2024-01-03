# HooKS  

## setState() - (01.js)

    const [name, setName] = React.useState(initialName)  

is the same as  

    const nameState = React.useState(initialName)
    const name = nameState[0]
    const setName = nameState[1]  

But we can use destructuring to make it more readable:  

    const [name, setName] = React.useState(initialName)   

It seems obvious because we know the order of the array, but it's not obvious to the compiler.  
And it's obviously stting an aray to a variable, but unless you actually think about it... you might not realize it.  

To set a placeholder use value attribute (Y U NO USE PLACEHOLDER?)  

    <input value={name} onChange={handleChange} id="name" />   

This has all been in function Greeting, and then we use Grreting as a component in App. 
NB: `{initialName = ''}` is a default value for the prop `initialName`. But it's not a default value for the state. 
The state is set by the prop, but the prop is not set by the state.  
In other words, `initialName = ''` is not initializing to an empty string, it works like a tertiary if statement.
Complete code:   

import * as React from 'react'
    function Greeting({initialName = ''}) {
    const [name, setName] = React.useState(initialName)

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
    return <Greeting initialName='Jemima Rhymer' />
    }

    export default App



## useEffect(persistentState === true)  - (02.js)  

React.useEffect is a built-in hook that allows you to run some custom code after React renders (and re-renders) your component to the DOM. It accepts a callback function which React will call after the DOM has been updated

    React.useEffect(() => {
      document.title = name
    })

is the same as  
    
        React.useEffect(() => {
        document.title = name
        }, [name])  

But we can use destructuring to make it more readable ^^^   

The second example could also be written without the 2nd argumeent, `[name]` as:  

    React.useEffect(() => {
        document.title = name
        })  

The difference is that: 

`React.useEffect(() => { window.localStorage.setItem('name', name) }, [name]):`

In this version of useEffect, the second argument is the dependency array [name]. This means the effect will only re-run if the value of name changes between renders. When a value in the dependency array changes, React will re-run the effect. In this case, the effect is setting the name value in the local storage. So, if name changes, the effect will run again and update the local storage with the new value of name.

`React.useEffect(() => { window.localStorage.setItem('name', name) }):`

In this version of useEffect, there is no dependency array provided. This means the effect will run after every render. It doesn't specifically watch any variable, so it will run every time the component renders or re-renders. In this case, it will also update the name value in the local storage every time the component renders.

The key difference is in how often these effects run:

* The first one runs whenever the name variable changes.
* The second one runs after every render, regardless of whether name has changed or not.  

If you supply an empty dependency array, the effect will only run once, after the initial render. This is similar to componentDidMount and componentWillUnmount. *BUT the localstorage value of name would not get updated if the name prop changes.*

    React.useEffect(() => {
        document.title = name
        }, [])

Also worth noting is that the dependency array, despite only having a single value in out example above, is an **array**. so
    
        React.useEffect(() => {
            document.title = name
            }, [name, age, height])

would run the effect if any of the values in the dependency array changed.  
That's important, we can watch age and height for changes too, and update name in localstorage if any of them change.  

## Lifting state up - (03.js)  

To lift state you need to move the state up to the (nearest) parent component. 
In this case, we move the useState for animal from func FavoriteAnimal to App.
FavoriteAnimal component is used in App > form > FavoriteAnimal. There it calls onAnimalChange, which is a prop passed down from App.
App has the useState for animal, and the prop onAnimalChange, which is a function that sets the state for animal.
So, FavoriteAnimal calls onAnimalChange, which is a function that sets the state for animal.  

    function FavoriteAnimal({ animal, onAnimalChange }) {
    return (
        <form>
        <label htmlFor="animal">Favorite Animal</label>
        <input
            id="animal"
            type="text"
            value={animal}
            onChange={(event) => onAnimalChange(event.target.value)}
        />
        </form>
    )
    }

    function App() {
    const [animal, setAnimal] = React.useState('')
    const [dishes, setDishes] = React.useState(dishesInitial)

    function handleChange(animal) {
        setAnimal(animal)
    }

    return (
        <div>
        <FavoriteAnimal animal={animal} onAnimalChange={handleChange} />
        </div>
    )
    }

    export default App

The opposite of this os called 'colocation' and is when you keep the state in the component that uses it. There is a performace gain, because when name changes we don't need to re-render the whole app, just the Animal component.
But it's not always possible to keep state in the component that uses it. Sometimes you need to lift state up.

## useState: tic tac toe - (04.js)  

   *  Managed State: State that you need to explicitly manage
   *  Derived State: State that you can calculate based on other state

'squares' is the managed state and it's the state of the board in a single-dimensional array:
    
    [
    'X', 'O', 'X',
    'X', 'O', 'O',
    'X', 'X', 'O'
    ]

See the 04.md for the rest of the exercise text. 

What we did here: 
Create a useState for the board, and a function to calculate the winner. 
Set up some consts that take the calculate[functionName] functions as values. 
Then we used the winner function to calculate the winner, and if there is a winner, we display the winner.  
If there is no winner, we display the next player.  
Then we created a handleClick function that checks if there is a winner, and if there is, it returns early.
If there is no winner, it sets the board state to the new board state.

So, we set 'squares' to use useState(), and then the calculate functions use 'sqaures' as derived state. 
This is a good example of how to use useState() and derived state.

## useState: tic tac toe - (05.js)


## useEffect: HTTP requests - (06.js)

this does not work, don't do this:

    React.useEffect(async () => {
            const result = await doSomeAsyncThing()
        // do something with the result
        })

The reason this doesn't work is because when you make a function async, it automatically returns a promise (whether you're not returning anything at all, or explicitly returning a function). This is due to the semantics of async/await syntax. So if you want to use async/await.  

Instead you need to do this 

    React.useEffect(() => {
      async function effect() {
      const result = await doSomeAsyncThing()
      // do something with the result
    }
      effect()
    })

This ensures that you don't return anything but a cleanup function.  

HOWEVER, THE EASIEST OR MOST SUCCINC WAY TO DO IT IS WITH A PROMISE AND *THEN*  

    React.useEffect(() => {
      doSomeAsyncThing().then(result => {
      // do something with the result
    })
    })

