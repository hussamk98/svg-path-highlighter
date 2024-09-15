import { SVGHighlighterConfig, SVGPath } from "./types";

const SELECTED_COLOR = "rgba(255, 0, 0, 0.5)";
const HOVER_COLOR = "rgba(255, 0, 0, 0.5)";
const UNSELECTED_COLOR = "rgba(255, 255, 255, 0.5)";

interface GroupConfig {
	[key: string]: string[];
}

class SVGPathHighlighter {
	private svgContainer: HTMLElement;
	private config: SVGHighlighterConfig;
	private groupConfig: GroupConfig;
	private selectedPaths: string[];
	private svgElement: SVGSVGElement | null = null;

	private handleMouseOver: (event: MouseEvent) => void;
	private handleMouseOut: (event: MouseEvent) => void;
	private handleClick: (event: MouseEvent) => void;
	private emitSelectionChange: () => void;

	constructor(
		svgContainer: HTMLElement,
		config: SVGHighlighterConfig,
		groupConfig?: GroupConfig
	) {
		this.svgContainer = svgContainer;
		this.config = config;
		this.groupConfig = groupConfig || {};
		this.selectedPaths = [];
		this.validateGroupConfig();

		this.handleMouseOver = this.onMouseOver.bind(this);
		this.handleMouseOut = this.onMouseOut.bind(this);
		this.handleClick = this.onClick.bind(this);
		this.emitSelectionChange = this.onSelectionChange.bind(this);

		this.init();
	}

	public validateGroupConfig() {
		const allPaths = new Set<string>();
		for (const [group, paths] of Object.entries(this.groupConfig)) {
			paths.forEach(part => {
				if (allPaths.has(part)) {
					throw new Error(
						`Path with id "${part}" is repeated in group "${group}" or another group.`
					);
				}
				allPaths.add(part);
			});
		}
	}

	private init() {
		this.createSvg();
		if (this.svgElement) {
			this.svgElement.addEventListener("mouseover", this.handleMouseOver);
			this.svgElement.addEventListener("mouseout", this.handleMouseOut);
			this.svgElement.addEventListener("click", this.handleClick);
		}
		this.applyUnselectedColors();
	}

	private createSvg() {
		const svgElement = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"svg"
		);
		svgElement.setAttribute("width", "100%");
		svgElement.setAttribute("height", "100%");
		svgElement.setAttribute(
			"viewBox",
			`0 0 ${this.config.image.width} ${this.config.image.height}`
		);
		svgElement.setAttribute("fill", "none");
		svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		svgElement.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

		const defsElement = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"defs"
		);
		const patternElement = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"pattern"
		);
		patternElement.setAttribute("id", "pattern0_125_351");
		patternElement.setAttribute("patternContentUnits", "objectBoundingBox");
		patternElement.setAttribute("width", "1");
		patternElement.setAttribute("height", "1");

		const useElement = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"use"
		);
		useElement.setAttributeNS(
			"http://www.w3.org/1999/xlink",
			"xlink:href",
			`#${this.config.image.id}`
		);
		useElement.setAttribute("transform", this.config.image.transform);

		patternElement.appendChild(useElement);
		defsElement.appendChild(patternElement);

		const imageElement = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"image"
		);
		imageElement.setAttribute("id", this.config.image.id);
		imageElement.setAttribute("width", this.config.image.width.toString());
		imageElement.setAttribute("height", this.config.image.height.toString());
		imageElement.setAttributeNS(
			"http://www.w3.org/1999/xlink",
			"xlink:href",
			this.config.image.href
		);

		svgElement.appendChild(defsElement);
		svgElement.appendChild(imageElement);

		this.config.paths.forEach(part => {
			const pathElement = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"path"
			);
			pathElement.setAttribute("id", part.id);
			pathElement.setAttribute("d", part.path);
			pathElement.style.cursor = "pointer";
			svgElement.appendChild(pathElement);
		});

		this.svgContainer.appendChild(svgElement);
		this.svgElement = svgElement;
	}

	private applyUnselectedColors() {
		this.config.paths.forEach(part => {
			const element = this.svgElement?.getElementById(
				part.id
			) as SVGPathElement;
			if (element) {
				element.style.fill = UNSELECTED_COLOR;
			}
		});
	}

	private onMouseOver(event: MouseEvent) {
		const target = event.target as SVGPathElement;
		const part = this.getPathConfig(target.id);
		if (part) {
			const group = this.getGroupForPart(target.id);
			if (group) {
				group.forEach(id => {
					const element = this.svgElement?.getElementById(id) as SVGPathElement;
					if (element) {
						element.style.fill = this.selectedPaths.includes(id)
							? this.darkenColor(SELECTED_COLOR)
							: HOVER_COLOR;
					}
				});
			} else {
				target.style.fill = this.selectedPaths.includes(target.id)
					? this.darkenColor(SELECTED_COLOR)
					: HOVER_COLOR;
			}
		}
	}

	private onMouseOut(event: MouseEvent) {
		const target = event.target as SVGPathElement;
		const part = this.getPathConfig(target.id);
		if (part) {
			const group = this.getGroupForPart(target.id);
			if (group) {
				group.forEach(id => {
					const element = this.svgElement?.getElementById(id) as SVGPathElement;
					if (element) {
						element.style.fill = this.selectedPaths.includes(id)
							? SELECTED_COLOR
							: UNSELECTED_COLOR;
					}
				});
			} else {
				target.style.fill = this.selectedPaths.includes(target.id)
					? SELECTED_COLOR
					: UNSELECTED_COLOR;
			}
		}
	}

	private onClick(event: MouseEvent) {
		const target = event.target as SVGPathElement;
		const part = this.getPathConfig(target.id);
		if (part) {
			const group = this.getGroupForPart(target.id);
			if (group) {
				if (group.every(id => this.selectedPaths.includes(id))) {
					// Deselect the group
					group.forEach(id => {
						const element = this.svgElement?.getElementById(
							id
						) as SVGPathElement;
						if (element) {
							element.style.fill = UNSELECTED_COLOR;
						}
					});
					this.selectedPaths = this.selectedPaths.filter(
						id => !group.includes(id)
					);
				} else {
					// Select the group
					group.forEach(id => {
						const element = this.svgElement?.getElementById(
							id
						) as SVGPathElement;
						if (element) {
							element.style.fill = SELECTED_COLOR;
						}
					});
					this.selectedPaths.push(
						...group.filter(id => !this.selectedPaths.includes(id))
					);
				}
			} else {
				if (this.selectedPaths.includes(target.id)) {
					// Deselect the part
					target.style.fill = UNSELECTED_COLOR;
					this.selectedPaths = this.selectedPaths.filter(
						id => id !== target.id
					);
				} else {
					// Select the part
					target.style.fill = SELECTED_COLOR;
					this.selectedPaths.push(target.id);
				}
			}
			this.emitSelectionChange();
		}
	}

	private onSelectionChange() {
		const event = new CustomEvent("selectionChange", {
			detail: this.selectedPaths,
		});
		this.svgContainer.dispatchEvent(event);
	}

	private getPathConfig(id: string): SVGPath | undefined {
		return this.config.paths.find(part => part.id === id);
	}

	public setSelectedPaths(paths: string[]) {
		if (!Array.isArray(paths)) {
			throw new Error("Paths must be an array.");
		}

		if (
			paths.some(id => !this.config.paths.map(part => part.id).includes(id))
		) {
			throw new Error("Invalid path id.");
		}

		this.selectedPaths = paths;
		this.applyUnselectedColors();
		paths.forEach(id => {
			const element = this.svgElement?.getElementById(id) as SVGPathElement;
			if (element) {
				element.style.fill = SELECTED_COLOR;
			}
		});
	}

	public getSelectedpaths(): string[] {
		return this.selectedPaths;
	}

	public getConfig(): SVGHighlighterConfig {
		return this.config;
	}

	public destroy() {
		this.svgContainer.removeEventListener(
			"selectionChange",
			this.emitSelectionChange
		);
		if (this.svgElement) {
			this.svgElement.removeEventListener("mouseover", this.handleMouseOver);
			this.svgElement.removeEventListener("mouseout", this.handleMouseOut);
			this.svgElement.removeEventListener("click", this.handleClick);
		}
	}

	private getGroupForPart(id: string): string[] | null {
		for (const [group, parts] of Object.entries(this.groupConfig)) {
			if (parts.includes(id)) {
				return parts;
			}
		}
		return null;
	}

	private darkenColor(color: string): string {
		const rgba = color.match(/rgba?\((\d+), (\d+), (\d+),? (\d?.\d+)?\)/);
		if (rgba) {
			const r = Math.max(0, parseInt(rgba[1]) - 50);
			const g = Math.max(0, parseInt(rgba[2]) - 50);
			const b = Math.max(0, parseInt(rgba[3]) - 50);
			const a = rgba[4] ? parseFloat(rgba[4]) : 1;
			return `rgba(${r}, ${g}, ${b}, ${a})`;
		}
		return color;
	}
}

export default SVGPathHighlighter;
