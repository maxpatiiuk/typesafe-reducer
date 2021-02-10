function assertExhaustive(caseType: never): never {
	throw new Error(`Non-exhaustive switch. Unhandled case:${
		caseType as string
	}`);
}

export const generateReducer = <STATE,
	ACTION extends Action<string>>(
	obj: GenerateReducerDictionary<STATE, ACTION>,
): (state: STATE, key: ACTION) => STATE =>
	<Key2 extends keyof typeof obj>(
		state: STATE,
		action: Action<Key2>,
	) =>
		(
			obj != null && typeof obj[action['type']] === 'function'
		) ?
			obj[action['type']]({state, action: action as any}) :
			assertExhaustive(action['type'] as never);

export const generateDispatch = <ACTION extends Action<string>>(
	obj: GenerateDispatchDictionary<ACTION>,
): (key: ACTION) => void =>
	<Key2 extends keyof typeof obj>(
		action: Action<Key2>,
	) =>
		(
			obj != null && typeof obj[action['type']] === 'function'
		) ?
			obj[action['type']](action as any) :
			assertExhaustive(action['type'] as never);
