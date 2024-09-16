<script>
  import { writable } from 'svelte/store';
  import SVGPathHighlighterWrapper from './SVGPathHighlighterWrapper.svelte';

  const selectedPathsFront = writable([]);
  const selectedPathsBack = writable([]);

  const groupsFront = { group1: ["1", "2"] };
  const groupsBack = { group1: ["1", "2"] };

  const setSelectedPathsFront = (paths) => {
    selectedPathsFront.set(Array.isArray(paths) ? paths : []);
  };

  const setSelectedPathsBack = (paths) => {
    selectedPathsBack.set(Array.isArray(paths) ? paths : []);
  };
</script>

<style>
  .container {
    display: flex;
    gap: 1rem;
  }
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

<div class="container">
  <SVGPathHighlighterWrapper
    config="HumanBodyFront"
    groups={groupsFront}
    selectedPaths={$selectedPathsFront}
    setSelectedPaths={setSelectedPathsFront}
  />
  <SVGPathHighlighterWrapper
    config="HumanBodyBack"
    groups={groupsBack}
    selectedPaths={$selectedPathsBack}
    setSelectedPaths={setSelectedPathsBack}
  />
  <div class="json-container">
    <pre><code>{JSON.stringify($selectedPathsFront, null, 4)}</code></pre>
    <pre><code>{JSON.stringify($selectedPathsBack, null, 4)}</code></pre>
  </div>
</div>