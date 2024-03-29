# typesafe-reducer

A TypeScript library that helps create type-safe dispatcher and reducer
functions

In order to use this library, you should have some familiarity with
[Typescript ADTs](http://www.javiercasas.com/articles/typescript-adts)

## Installation

Install the package:

```sh
npm install typesafe-reducer
```

Import it into your script:

```typescript
import { generateReducer, State, Action } from 'typesafe-reducer';
```

## Usage

```typescript
// Let's imagine that our application can have two states
// (`MainState` and `LoadingState`). We would create an interface for each
// state, with a `type` property that is going to be used to
// discriminate between the states:
type LoadingState = State<'LoadingState', {
  readonly task: Promise<string[]>;
}>;
type MainState = State<'MainState', {
  readonly data: string[];
}>;

// And we should create a type called `states` that would combine all
// of the states our application has
type States =
  | LoadingState;
  | MainState;

// Let's do something similar for all the possible actions:
type LoadedAction = Action<'LoadedAction', {
  readonly data: string[];
}>;
type BeginLoadingAction = Action<'BeginLoadingAction'>;

type Actions =
  | LoadedAction
  | BeginLoadingAction;

// Now we can create the reducer:
// Notice how we supply state and action types in `<States, Actions>`
const reducer = generateReducer<States, Actions>({`
  'LoadedAction':({state, action})=>{
    return {
      type: 'MainState',
      data: action.data,
    };
  },
  'BeginLoadingAction':({state, action})=>{
    return {
      type: 'LoadingState',
      task: new Promise((resolve)=>
        setTimeout(()=>{
          resolve(['test','test','test']);
        },1000);
      );
    };
  }
});

// Now, you can use React's useReducer like this:
// https://github.com/specify/specify7/blob/90d80aae15ddbb588ea3fe556be3538db5e19483/specifyweb/frontend/js_src/lib/components/wbplanview.tsx#L84
// Or create your own dispatch:
const dispatch = (state:states,action:actions)=>{
  const newState = reducer(state,action);

  //handle setState here
  console.log(newState);
}

// After that, you can call the dispatch function from anywhere and
// provide the necessary arguments (`currentState` state is the
// current state of the application)
window.addEventListener('click', ()=>
  dispatch(
    currentState,
    {
      type: 'InitializeLoadingAction',
    }
  )
);

// Alternatively, you may want to mutate the current state inside of
// the reducer (though, be careful with it as side effects are
// dangerous)
let state:State1 = {
  type: 'State1',
  field: 'qwerty',
}
const dispatch = generateDispatch<actions>({
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

## Advanced Usage

```typescript
// There is a functionality to limit certain action calls only to some
// events. If action is called from a wrong event, an exception is
// triggered.
// To implement this, wrap reducer handler in an ensureState function,
// where first argument is an array of allowed types and second argument
// is the handler. Example:

const reducer = generateReducer<States, Actions>({`
  // Only allow calling LoadedAction from LoadingState
  'LoadedAction': ensureState(['LoadingState'],({state, action})=>{
    return {
      type: 'MainState',
      data: action.data,
    };
  }),
  'BeginLoadingAction': ensureState(['MainState'],({state, action})=>{
    return {
      type: 'LoadingState',
      task: new Promise((resolve)=>
        setTimeout(()=>{
          resolve(['test','test','test']);
        },1000);
      );
    };
  })
});
```

## Credit

Some code was based on
[babakness/exhaustive-type-checking](https://github.com/babakness/exhaustive-type-checking)
