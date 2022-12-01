import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

/**
 * `useEffect` that will only execute the effect on first update of dependencies onward.
 *
 * @param effect Imperative function that can return a cleanup function
 * @param dependencies If present, effect will only activate if the values in the list change.
 */
export const useUpdateEffect = (
	effect: EffectCallback,
	dependencies?: DependencyList
) => {
	const firstRenderRef = useRef(true)

	useEffect(() => {
		if (firstRenderRef.current) {
			firstRenderRef.current = false
			return
		}
		return effect()
	}, dependencies)
}
