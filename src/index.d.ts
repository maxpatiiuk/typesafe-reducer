export interface Action<ACTION_NAME extends string> {
	type: ACTION_NAME
}

export interface State<STATE_NAME extends string> {
	type: STATE_NAME
}

type GenerateReducerDictionary<STATE, ACTION extends Action<string>> = {
	[actionType in ACTION['type']]: (props:{
		state: STATE,
		action: Extract<ACTION, Action<actionType>>
	}) => STATE
}

type GenerateDispatchDictionary<ACTION extends Action<string>> = {
	[actionType in ACTION['type']]: (
		action: Extract<ACTION, Action<actionType>>
	) => void
}
