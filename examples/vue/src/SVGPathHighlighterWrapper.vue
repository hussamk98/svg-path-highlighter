<template>
	<div ref="svgContainer" style="width: 500px"></div>
</template>

<script setup>
import { ref, onMounted, defineProps, onBeforeUnmount } from "vue";
import SVGPathHighlighter from "../../../dist/index.esm";
import { loadConfig } from "../../../dist/configLoader.esm";

const props = defineProps({
	config: String,
	groups: Object,
});

const modelValue = defineModel();

const svgContainer = ref(null);
let highlighter = null;

onMounted(async () => {
	const config = await loadConfig(props.config);
	highlighter = new SVGPathHighlighter(
		svgContainer.value,
		config,
		props.groups
	);
	highlighter.setSelectedPaths(modelValue.value);

	svgContainer.value.addEventListener("selectionChange", event => {
		modelValue.value = JSON.parse(JSON.stringify(event.detail));
	});
});

onBeforeUnmount(() => {
	if (highlighter) {
		highlighter.destroy();
	}
});
</script>
