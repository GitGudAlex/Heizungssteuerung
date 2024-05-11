<script>
  import { onMount } from 'svelte';
  import FloorplanLightMode from '../floorplans/FloorplanLightModeAllHeaters.svg?raw';

  let svgContent = '';
  let focusedElement = null;

  // Mouse Events
  function handleMouseOver(e) {
    if(e.target.tagName == 'path'){
      handleTooltip(e);
    }
	}
	function handleMouseOut(e) {
		console.log('Mouse out');
    const tooltip = document.querySelector('.tooltip');
    tooltip.classList.add('hidden');
	}

  function onClick(e) {
    if (e.target.tagName !== 'path') return;
    console.log(e.target.id);
  }

  // Keyboard Events
  /*
  function onKeyDown(e) {
  }
  */
  function onFocusIn(e) {
    if (e.target.tagName == 'path') {
      handleTooltip(e);
    }
  }

  function handleFocusOut() {
    if (focusedElement !== document.activeElement) {
      const tooltip = document.querySelector('.tooltip');
      tooltip.classList.add('hidden');
    }
  }

  function loadSVG(svgName) {
    console.log('Loading SVG:', svgName)
    if (svgName === 'FloorplanLightMode') {
      svgContent = FloorplanLightMode;
    } //else if (svgName === 'FloorplanDarkMode') {
      //svgContent = FloorplanDarkMode;
   // }
  }

  onMount(() => {
    loadSVG('FloorplanLightMode');
  });

  function changeSVG(svgName) {
    const paths = document.querySelectorAll('path');
    paths.forEach(path => {
      path.removeEventListener('click', onClick);
    });

    // Load the selected SVG
    loadSVG(svgName);
  }

  function handleTooltip(e){
    const rect = e.target.getBoundingClientRect();
    const tooltip = document.querySelector('.tooltip');
    if (tooltip.classList.contains('hidden')) {
      tooltip.style.top = `${rect.top - 30}px`;
      tooltip.style.left = `${rect.left}px`;
      tooltip.textContent = e.target.id;
      tooltip.classList.remove('hidden');
    }
    focusedElement = e.target;
  }
</script>

<!-- Tooltip -->
<div class="tooltip hidden absolute bg-black text-white rounded p-1">
  Tooltip Text
</div>

<div class="interactive-svg" on:click={onClick} on:mouseover={handleMouseOver} on:mouseout={handleMouseOut} on:focusin={onFocusIn} on:focusout={handleFocusOut} >
  {@html svgContent}
</div>