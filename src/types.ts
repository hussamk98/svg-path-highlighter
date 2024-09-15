export interface SVGPath {
	id: string;
	path: string;
}

export interface SVGHighlighterConfig {
	image: {
		id: string;
		width: number;
		height: number;
		href: string;
		transform: string;
	};
	paths: SVGPath[];
}
