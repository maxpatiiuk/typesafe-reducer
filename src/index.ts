/*
 *
 * Generator of type-safe reducer and dispatches
 * Replaces the need for switch(){} statements
 *
 */

export type Action<
  ACTION_NAME extends string,
  ACTION_CONTENT extends Record<string, unknown> = Record<never, unknown>
> = { type: ACTION_NAME } & ACTION_CONTENT;

export type State<
  STATE_NAME extends string,
  STATE_CONTENT extends Record<string, unknown> = Record<never, unknown>
> = { type: STATE_NAME } & STATE_CONTENT;

function assertExhaustive(caseType: never): never {
  throw new Error(
    `Non-exhaustive switch. Unhandled case: ${caseType as string}`
  );
}

export const generateReducer =
  <STATE, ACTION extends Action<string>>(object: {
    [actionType in ACTION['type']]: (props: {
      readonly state: STATE;
      readonly action: Extract<ACTION, Action<actionType>>;
    }) => STATE;
  }): ((state: STATE, key: ACTION) => STATE) =>
  <KEY extends keyof typeof object>(
    state: STATE,
    action: Readonly<Action<KEY>>
  ): STATE =>
    typeof object[action.type] === 'function'
      ? object[action.type]({
          state,
          action: action as Extract<ACTION, Action<KEY>>,
        })
      : assertExhaustive(action.type as never);

export const generateDispatch =
  <ACTION extends Action<string>>(object: {
    [actionType in ACTION['type']]: (
      action: Extract<ACTION, Action<actionType>>
    ) => void;
  }): ((key: ACTION) => void) =>
  <KEY extends keyof typeof object>(action: Readonly<Action<KEY>>): void =>
    typeof object[action.type] === 'function'
      ? object[action.type](action as Extract<ACTION, Action<KEY>>)
      : assertExhaustive(action.type as never);

/*
 * Wrap Action handler in this function to ensure only certain states
 * Are allowed to emit this action
 */
export function ensureState<
  STATES extends { readonly type: string },
  ACTION extends { readonly type: string },
  TYPES extends STATES['type']
>(
  emittedFrom: ReadonlyArray<TYPES>,
  handler: (payload: {
    readonly state: STATES & { readonly type: TYPES };
    readonly action: ACTION;
  }) => STATES
) {
  return ({
    state,
    action,
  }: {
    readonly state: STATES;
    readonly action: ACTION;
  }) => {
    if (emittedFrom.includes(state.type as TYPES))
      return handler({
        state: state as STATES & { readonly type: TYPES },
        action,
      });
    else
      throw new Error(
        `Action called from state ${state.type}. ` +
          `Allowed states: ${emittedFrom.join(', ')}`
      );
  };
}
