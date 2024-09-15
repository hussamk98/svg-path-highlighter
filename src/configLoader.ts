import { SVGHighlighterConfig } from "./types";

export async function loadConfig(configName: string): Promise<SVGHighlighterConfig> {
	switch (configName) {
		case "HumanBodyFront":
			return import("./configs/body-front-config.json").then(
				module => module.default as unknown as SVGHighlighterConfig
			);
		case "HumanBodyBack":
			return import("./configs/body-back-config.json").then(
				module => module.default as unknown as SVGHighlighterConfig
			);
		default:
			throw new Error(`Unknown config: ${configName}`);
	}
}
