// src/configLoader.test.ts
import { loadConfig } from "../src/configLoader";
import SVGPathHighlighter from "../src/index";

jest.mock("../src/configs/body-front-config.json", () => ({
	__esModule: true,
	default: {
		image: {
			id: "body-front",
			width: 100,
			height: 200,
			href: "data:image/png;base64,front",
			transform: "",
		},
		paths: [
			{ id: "front-part1", path: "M10 10 H 90 V 90 H 10 Z" },
			{ id: "front-part2", path: "M20 20 H 80 V 80 H 20 Z" },
		],
	},
}));

jest.mock("../src/configs/body-back-config.json", () => ({
	__esModule: true,
	default: {
		image: {
			id: "body-back",
			width: 100,
			height: 200,
			href: "data:image/png;base64,back",
			transform: "",
		},
		paths: [
			{ id: "back-part1", path: "M10 10 H 90 V 90 H 10 Z" },
			{ id: "back-part2", path: "M20 20 H 80 V 80 H 20 Z" },
		],
	},
}));

describe("loadConfig", () => {
	it("should load HumanBodyFront configuration", async () => {
		const config = await loadConfig("HumanBodyFront");
		expect(config.image.id).toBe("body-front");
		expect(config.paths).toHaveLength(2);
	});

	it("should load HumanBodyBack configuration", async () => {
		const config = await loadConfig("HumanBodyBack");
		expect(config.image.id).toBe("body-back");
		expect(config.paths).toHaveLength(2);
	});

	it("should throw an error for unknown configuration", async () => {
		await expect(loadConfig("UnknownConfig")).rejects.toThrow(
			"Unknown config: UnknownConfig"
		);
	});
});

describe("SVGPathHighlighter with loaded config", () => {
	let svgContainer: HTMLElement;

	beforeEach(() => {
		svgContainer = document.createElement("div");
		document.body.appendChild(svgContainer);
	});

	afterEach(() => {
		document.body.removeChild(svgContainer);
	});

	it("should initialize with HumanBodyFront configuration", async () => {
		const config = await loadConfig("HumanBodyFront");
		const highlighter = new SVGPathHighlighter(svgContainer, config);
		expect(highlighter.getConfig()).toEqual(config);
		expect(svgContainer.querySelector("svg")).not.toBeNull();
	});

	it("should initialize with HumanBodyBack configuration", async () => {
		const config = await loadConfig("HumanBodyBack");
		const highlighter = new SVGPathHighlighter(svgContainer, config);
		expect(highlighter.getConfig()).toEqual(config);
		expect(svgContainer.querySelector("svg")).not.toBeNull();
	});
});
