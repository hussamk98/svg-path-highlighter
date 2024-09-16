<script>
  import { onMount, onDestroy } from 'svelte';
  import SVGPathHighlighter from 'svg-path-highlighter';
  import { loadConfig } from 'svg-path-highlighter/configLoader';

  export let config;
  export let groups;
  export let selectedPaths;
  export let setSelectedPaths;

  let svgContainer = null;
  let highlighter = null;

  const handleSelectionChange = (event) => {
    const paths = Array.isArray(event.detail) ? event.detail : [];
    setSelectedPaths(JSON.parse(JSON.stringify(paths)));
  };

  onMount(async () => {
    const configData = await loadConfig(config);
    if (svgContainer) {
      highlighter = new SVGPathHighlighter(svgContainer, configData, groups);
      highlighter.setSelectedPaths(Array.isArray(selectedPaths) ? selectedPaths : []);

      svgContainer.addEventListener('selectionChange', handleSelectionChange);
    }
  });

  onDestroy(() => {
    if (highlighter) {
      highlighter.destroy();
    }
    if (svgContainer) {
      svgContainer.removeEventListener('selectionChange', handleSelectionChange);
    }
  });

  $: if (highlighter) {
    highlighter.setSelectedPaths(Array.isArray(selectedPaths) ? selectedPaths : []);
  }
</script>

<div bind:this={svgContainer} style="width: 500px;"></div>