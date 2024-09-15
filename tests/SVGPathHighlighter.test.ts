import SVGPathHighlighter from "../src/index";
import { SVGHighlighterConfig } from "../src/types";
import { loadConfig } from "../src/configLoader";

jest.mock("../src/configLoader", () => ({
	loadConfig: jest.fn(),
}));

const mockConfig: SVGHighlighterConfig = {
	image: {
		id: "test-image",
		width: 100,
		height: 100,
		href: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABKklEQVR42mNgwAEHj==",
		transform: "",
	},
	paths: [
		{ id: "part1", path: "M10 10 H 90 V 90 H 10 Z" },
		{ id: "part2", path: "M20 20 H 80 V 80 H 20 Z" },
	],
};

describe("SVGPathHighlighter", () => {
	let svgContainer: HTMLElement;

	beforeEach(() => {
		svgContainer = document.createElement("div");
		document.body.appendChild(svgContainer);
		(loadConfig as jest.Mock).mockResolvedValue(mockConfig);
	});

	afterEach(() => {
		document.body.removeChild(svgContainer);
		jest.clearAllMocks();
	});

	it("should initialize with the correct configuration", async () => {
		const highlighter = new SVGPathHighlighter(svgContainer, mockConfig);
		expect(highlighter.getConfig()).toEqual(mockConfig);
		expect(svgContainer.querySelector("svg")).not.toBeNull();
	});

	it("should highlight a part on mouse over", async () => {
		new SVGPathHighlighter(svgContainer, mockConfig);
		const part = svgContainer.querySelector("#part1") as SVGElement;
		const mouseOverEvent = new MouseEvent("mouseover", { bubbles: true });
		part.dispatchEvent(mouseOverEvent);
		expect(part.style.fill).toBe("rgba(255, 0, 0, 0.5)");
	});

	it("should revert part color on mouse out", async () => {
		new SVGPathHighlighter(svgContainer, mockConfig);
		const part = svgContainer.querySelector("#part1") as SVGElement;
		const mouseOutEvent = new MouseEvent("mouseout", { bubbles: true });
		part.dispatchEvent(mouseOutEvent);
		expect(part.style.fill).toBe("rgba(255, 255, 255, 0.5)");
	});

	it("should select a part on click", async () => {
		const highlighter = new SVGPathHighlighter(svgContainer, mockConfig);
		const part = svgContainer.querySelector("#part1") as SVGElement;
		const clickEvent = new MouseEvent("click", { bubbles: true });
		part.dispatchEvent(clickEvent);
		expect(part.style.fill).toBe("rgba(255, 0, 0, 0.5)");
		expect(highlighter.getSelectedpaths()).toContain("part1");
	});

	it("should deselect a part on second click", async () => {
		const highlighter = new SVGPathHighlighter(svgContainer, mockConfig);
		const part = svgContainer.querySelector("#part1") as SVGElement;
		const clickEvent = new MouseEvent("click", { bubbles: true });
		part.dispatchEvent(clickEvent); // Select
		part.dispatchEvent(clickEvent); // Deselect
		expect(part.style.fill).toBe("rgba(255, 255, 255, 0.5)");
		expect(highlighter.getSelectedpaths()).not.toContain("part1");
	});

	it("should validate group configuration", async () => {
		const groupConfig = {
			group1: ["part1", "part2"],
			group2: ["part3"],
		};
		const highlighter = new SVGPathHighlighter(
			svgContainer,
			mockConfig,
			groupConfig
		);
		expect(() => highlighter.validateGroupConfig()).not.toThrow();
	});

	it("should throw an error for invalid group configuration", async () => {
		const groupConfig = {
			group1: ["part1", "part2"],
			group2: ["part1"],
		};
		let error;
		try {
			new SVGPathHighlighter(svgContainer, mockConfig, groupConfig);
		} catch (e) {
			error = e;
		}
		expect(error).toEqual(
			new Error(
				`Path with id "part1" is repeated in group "group2" or another group.`
			)
		);
	});

	it("should handle mouse events correctly", async () => {
		const highlighter = new SVGPathHighlighter(svgContainer, mockConfig);
		const part = svgContainer.querySelector("#part1") as SVGElement;

		const mouseOverEvent = new MouseEvent("mouseover", { bubbles: true });
		part.dispatchEvent(mouseOverEvent);
		expect(part.style.fill).toBe("rgba(255, 0, 0, 0.5)");

		const mouseOutEvent = new MouseEvent("mouseout", { bubbles: true });
		part.dispatchEvent(mouseOutEvent);
		expect(part.style.fill).toBe("rgba(255, 255, 255, 0.5)");

		const clickEvent = new MouseEvent("click", { bubbles: true });
		part.dispatchEvent(clickEvent);
		expect(part.style.fill).toBe("rgba(255, 0, 0, 0.5)");
		expect(highlighter.getSelectedpaths()).toContain("part1");

		part.dispatchEvent(clickEvent);
		expect(part.style.fill).toBe("rgba(255, 255, 255, 0.5)");
		expect(highlighter.getSelectedpaths()).not.toContain("part1");
	});

	it("should handle multiple parts correctly", async () => {
		const highlighter = new SVGPathHighlighter(svgContainer, mockConfig);
		const part1 = svgContainer.querySelector("#part1") as SVGElement;
		const part2 = svgContainer.querySelector("#part2") as SVGElement;

		const clickEvent = new MouseEvent("click", { bubbles: true });
		part1.dispatchEvent(clickEvent);
		part2.dispatchEvent(clickEvent);

		expect(part1.style.fill).toBe("rgba(255, 0, 0, 0.5)");
		expect(part2.style.fill).toBe("rgba(255, 0, 0, 0.5)");
		expect(highlighter.getSelectedpaths()).toContain("part1");
		expect(highlighter.getSelectedpaths()).toContain("part2");

		part1.dispatchEvent(clickEvent);
		part2.dispatchEvent(clickEvent);

		expect(part1.style.fill).toBe("rgba(255, 255, 255, 0.5)");
		expect(part2.style.fill).toBe("rgba(255, 255, 255, 0.5)");
		expect(highlighter.getSelectedpaths()).not.toContain("part1");
		expect(highlighter.getSelectedpaths()).not.toContain("part2");
	});

	it("should set selected paths correctly", async () => {
		const highlighter = new SVGPathHighlighter(svgContainer, mockConfig);
		highlighter.setSelectedPaths(["part1", "part2"]);
		expect(highlighter.getSelectedpaths()).toEqual(["part1", "part2"]);
		const part1 = svgContainer.querySelector("#part1") as SVGElement;
		const part2 = svgContainer.querySelector("#part2") as SVGElement;
		expect(part1.style.fill).toBe("rgba(255, 0, 0, 0.5)");
		expect(part2.style.fill).toBe("rgba(255, 0, 0, 0.5)");
	});

	it("should throw an error for invalid selected paths", async () => {
		const highlighter = new SVGPathHighlighter(svgContainer, mockConfig);
		expect(() => highlighter.setSelectedPaths(["invalid-part"])).toThrow(
			"Invalid path id."
		);
	});

	it("should destroy correctly", async () => {
		const highlighter = new SVGPathHighlighter(svgContainer, mockConfig);
		highlighter.destroy();
		const part = svgContainer.querySelector("#part1") as SVGElement;
		const clickEvent = new MouseEvent("click", { bubbles: true });
		part.dispatchEvent(clickEvent);
		expect(highlighter.getSelectedpaths()).not.toContain("part1");
	});
});
