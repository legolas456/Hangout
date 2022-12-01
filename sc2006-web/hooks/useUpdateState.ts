import { Dispatch, SetStateAction, useState } from 'react'

export type UpdateState<S> = (
	state: Partial<S> | ((prevState: S) => Partial<S>),
) => void;

/**
 * Hook that returns a `updateState` function that works like `setState` of a React class component.
 *
 * @param initialState initial state
 * @returns [state, updateState, setState]
 */

function useUpdateState<S extends Record<string, any>> (
	initialState: S | (() => S)
): [
	state: S,
	updateState: UpdateState<S>,
	setState: Dispatch<SetStateAction<S>>,
] {
	const [state, setState] = useState<S>(initialState)

	const updateState: UpdateState<S> = (update) => {
		if (typeof update === 'function') {
			setState((prevState) => ({ ...prevState, ...update(prevState) }))
		} else {
			setState((prevState) => ({ ...prevState, ...update }))
		}
	}

	return [state, updateState, setState]
}

export { useUpdateState }
