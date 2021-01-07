# typesafe_reducer
A TypeScript library that helps create a type safe dispatchers and reducer functions

## Usage
```js
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

// Now, let's do something similar for the actions:
interface Action1 {
	type: 'Action1',
	field: string,
}
interface Action2 {
	type: 'Action2',
	is: boolean,
}
type actions = Action1|Action2;

// Now we can create our reducer:
const reducer = generate_reducer<states, actions>({
	'Action1':(state,action)=>{
		// create a new state here and return it
		return state;
	},
	'Action2':(state,action)=>{
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

// Alternatively, you may want to mutate the current state inside of the reducer (though, be careful with it as that may lead to unexpected side effects)
let state:State1 = {
	type: 'State1',
	field: 'qwerty',
}
const mutable_reducer = generate_mutable_reducer<actions>({
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
