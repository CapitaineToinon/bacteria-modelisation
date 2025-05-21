import { presetDaisy } from "@ameinhardt/unocss-preset-daisy";
import config from "@slidev/client/uno.config";

export default function() {
	return {
		...config,
		presets: [
			...config.presets || [],
			presetDaisy(),
		],
	}
}
