<script setup>
import { ref } from "vue";
import SVGPathHighlighterWrapper from "./SVGPathHighlighterWrapper.vue";

const selectedPaths = ref({ front: [], back: [] });
const groupsFront = ref({
	group1: ["1", "2"],
});
const groupsBack = ref({
	group1: ["1", "2"],
});
</script>

<template>
	<div style="display: flex; gap: 1rem">
		<SVGPathHighlighterWrapper
			v-model="selectedPaths.front"
			config="HumanBodyFront"
			:groups="groupsFront"
		/>
		<SVGPathHighlighterWrapper
			v-model="selectedPaths.back"
			config="HumanBodyBack"
			:groups="groupsBack"
		/>
		<div class="json-container">
			<pre><code>{{ JSON.stringify(selectedPaths, null, 4) }}</code></pre>
		</div>
	</div>
</template>

<style scoped>
.json-container {
	width: 100%;
	border: 1px solid #ccc;
	padding: 10px;
	background-color: #f9f9f9;
	border-radius: 5px;
	overflow-x: auto;
	max-width: 400px;
}

pre {
	margin: 0;
	font-family: monospace;
}
</style>
