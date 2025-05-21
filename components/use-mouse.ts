import { type UseMouseEventExtractor, type UseMouseOptions, useMouse as _useMouse } from "@vueuse/core"

const extractor: UseMouseEventExtractor = (event) => {
	if (event instanceof MouseEvent) return [event.offsetX, event.offsetY]
	else return null
}

export function useMouse({ target }: Pick<UseMouseOptions, "target">) {
	return _useMouse({ target, type: extractor })
}
