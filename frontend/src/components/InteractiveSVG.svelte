<script>
  import { onMount } from 'svelte';
  import { deviceList } from '~/stores/deviceStore.ts';
  import FloorplanLightMode from '../floorplans/FloorplanLightModeAllHeaters.svg?raw';
  import { get } from 'svelte/store';

  let svgContent = '';
  let focusedElement = null;

  onMount(() => {
    loadSVG('FloorplanLightMode');
    filterSVGElements();
    deviceList.subscribe(() => {
      filterSVGElements();
    });
  });

  function filterSVGElements() {
    const devices = get(deviceList);
    const svgElement = document.querySelector('.interactive-svg svg');
    if (svgElement) {
      const paths = svgElement.querySelectorAll('path');

      paths.forEach(path => {
        const device = devices.find(d => d.heaterMap === path.id);
        if (device) {
          path.style.fill = '#fcba03';
          path.classList.remove('hidden');
          const textElement = svgElement.querySelector(`#Text${path.id}`);
          console.log("textElement", textElement);
          if (textElement) {
            textElement.style.display = '';
            const tspanElement = textElement.querySelector('tspan');
            if(tspanElement) {  
              // Set the temperature value - only visual e.g. `${device.temperature}°C`
              tspanElement.textContent = "16";
            }
          }
        } else {
          path.style.fill = "white";
          const textElement = svgElement.querySelector(`#Text${path.id}`);
          if (textElement) {
            //textElement.style.display = 'none';
            const tspanElement = textElement.querySelector('tspan');
            if(tspanElement){
              tspanElement.textContent = path.id;
            }
          }
        }
      });
    }
  }

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

    const devices = get(deviceList);
    const device = devices.find(d => d.heaterMap === e.target.id);
    if (device) {
      const deviceElement = document.getElementById(`device-${device.heaterMap}`);
      if (deviceElement) {
        deviceElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        deviceElement.focus({ preventScroll: true });
      }
      const inputField = deviceElement.querySelector('input[type="number"]');
            if (inputField) {
                inputField.focus();
            }
    }
  }

  // Keyboard Events
  function onKeyDown(e) {
    if (e.keyCode === 13) {
        onClick(e);
    }
  }
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
    if (svgName === 'FloorplanLightMode') {
      svgContent = FloorplanLightMode;
    } //else if (svgName === 'FloorplanDarkMode') {
      //svgContent = FloorplanDarkMode;
   // }
  }

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

<div class="interactive-svg" on:click={onClick} on:mouseover={handleMouseOver} on:mouseout={handleMouseOut} on:focusin={onFocusIn} on:focusout={handleFocusOut} on:keydown={onKeyDown} >
  {@html svgContent}
</div>