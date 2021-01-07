# typesafe_reducer
A TypeScript library that helps create type-safe dispatchers and reducer functions

In order to use this libriary, you should have some familiarity with [Typescript ADTs](http://www.javiercasas.com/articles/typescript-adts)

## Usage
```ts
// Let's imagine that our application can have two states (`State1` and `State2`)
// We would create an interface for each state, with a `type` property that is going to be used to discrimitate between the states:
interface State1 {
	type: 'State1',
	field: string,
}
interface State2 {
	type: 'State2',
	is: boolean,
}

// And we should create a type called `states` that would combine all of the states our application has
type states = State1|State2;

// Let's do something similar for all the posible actions:
interface Action1 {
	type: 'Action1',
	field: string,
}
interface Action2 {
	type: 'Action2',
	is: boolean,
}
type actions = Action1|Action2;

// Now we can create the reducer:
const reducer = generate_reducer<states, actions>({  // Notice how we supply state and action types in `<states, actions>`
	'Action1':(current_state,action)=>{
		// create a new state here and return it
		return state;
	},
	'Action2':(current_state,action)=>{
		// create a new state here and return in
		return state;
	}
});

// And the dispatch statement
const dispatch = (state:states,action:actions)=>{
	const new_state = reducer(state,action);

	//handle setState here
	console.log(new_state);
}

// After that, you can call the dispatch function from anywhere and provide the neccessary arguments
window.addEventListener('click', ()=>dispatch(current_state, { type: 'Action1', field: 'qwerty' }); // where `current_state` is the current state of the application

// Alternatively, you may want to mutate the current state inside of the reducer (though, be careful with it as side effects are dangerous)
let state:State1 = {
	type: 'State1',
	field: 'qwerty',
}
const dispatch = generate_dispatch<actions>({
	'Action1':(action)=>{
		state = { // mutate the external state 
			...state,
			type: 'State2',
			is: true,
		}
		console.log(state,action);
	},
	'Action2':(action)=>{
		//mutate the external state here
	}
});
```

## Credit
Some code was based on [babakness/exhaustive-type-checking](https://github.com/babakness/exhaustive-type-checking) repository
