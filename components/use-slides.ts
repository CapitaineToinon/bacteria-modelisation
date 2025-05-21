import { computed, onMounted, ref } from 'vue';
import { onSlideEnter as _ose, onSlideLeave as _osl, useIsSlideActive } from '@slidev/client';


export function useSlideEvents() {
	const isInitiallyActive = useIsSlideActive();
	const isActive = ref(isInitiallyActive.value);

	const oseSubs = new Set<() => void>();
	const oslSubs = new Set<() => void>();

	onMounted(() => {
		_ose(() => {
			if (isActive.value) {
				return;
			}

			isActive.value = true;

			for (const sub of oseSubs) {
				sub();
			}
		});

		_osl(() => {
			isActive.value = false;

			for (const sub of oslSubs) {
				sub();
			}
		});
	})

	return {
		isActive: computed(() => isActive.value),
		onSlideEnter: (callback: () => void) => {
			if (isActive.value) {
				callback();
				return;
			}
			oseSubs.add(callback);
		},
		onSlideLeave: (callback: () => void) => {
			if (!isActive.value) {
				callback();
				return;
			}
			oslSubs.add(callback);
		},
	}
}
