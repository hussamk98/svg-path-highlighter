import React, { useEffect, useRef } from "react";
import SVGPathHighlighter from "svg-path-highlighter";
import { loadConfig } from "svg-path-highlighter/configLoader";

interface SVGPathHighlighterWrapperProps {
	config: "HumanBodyFront" | "HumanBodyBack";
	groups: Record<string, string[]>;
	selectedPaths: string[];
	setSelectedPaths: (paths: string[]) => void;
}

const SVGPathHighlighterWrapper: React.FC<SVGPathHighlighterWrapperProps> =
	React.memo(({ config, groups, selectedPaths, setSelectedPaths }) => {
		const svgContainerRef = useRef<HTMLDivElement | null>(null);
		const highlighter = useRef<SVGPathHighlighter | null>(null);
		const isInitialized = useRef(false);

		useEffect(() => {
			const handleSelectionChange = (event: CustomEvent) => {
				setSelectedPaths(JSON.parse(JSON.stringify(event.detail)));
			};
			const initializeHighlighter = async () => {
				const configData = await loadConfig(config);
				if (svgContainerRef.current) {
					highlighter.current = new SVGPathHighlighter(
						svgContainerRef.current,
						configData,
						groups
					);
					highlighter.current.setSelectedPaths(selectedPaths);

					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					svgContainerRef.current.addEventListener(
						"selectionChange",
						handleSelectionChange
					);
				}
			};

			if (!isInitialized.current) {
				initializeHighlighter();
				isInitialized.current = true;
			}
		}, [config, groups, selectedPaths, setSelectedPaths]);

		return <div ref={svgContainerRef} style={{ width: "500px" }}></div>;
	});

export default SVGPathHighlighterWrapper;
