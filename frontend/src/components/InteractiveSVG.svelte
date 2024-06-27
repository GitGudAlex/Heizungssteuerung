<script lang="ts">
  import { onMount } from 'svelte';
  import { deviceList, loadCombinedHeaters } from '~/stores/deviceStore.ts';
  import FloorplanLightMode from '../floorplans/FloorplanLightModeAllHeaters.svg?raw';
  import FloorplanDarkMode from '../floorplans/FloorplanDarkModeAllHeaters.svg?raw';
  import { get } from 'svelte/store';

  export let translations: { [key: string]: string }
  export let lang: string

  let svgContent = ''
  let focusedElement = null;
  let showTemperature = true;

  onMount(() => {
    
    const darkModeStatus = localStorage.getItem('darkMode');
    const svgName = darkModeStatus === 'enabled' ? 'FloorplanDarkMode' : 'FloorplanLightMode';
    loadSVG(svgName);
    deviceList.subscribe(() => {
      filterSVGElements();
    });
    
    const darkModeToggle = document.querySelector('.darkmode-toggle');
    darkModeToggle.addEventListener('click', handleDarkModeToggle);
  });

  function handleDarkModeToggle() {
    const darkModeStatus = localStorage.getItem('darkMode');
    const svgName = darkModeStatus === 'enabled' ? 'FloorplanDarkMode' : 'FloorplanLightMode';
    loadSVG(svgName);
    loadCombinedHeaters(); // Update Sensor Data
  }

  function toggleShowTemperature() {
    showTemperature = !showTemperature;
    filterSVGElements();
  }

  function filterSVGElements() {
    const devices = get(deviceList)
    const svgElement = document.querySelector('.interactive-svg svg')
    if (svgElement) {
      const paths = svgElement.querySelectorAll('path')

      paths.forEach((path) => {
        const device = devices.find((d) => d.heaterMap === path.id)
        if (device) {
          path.style.fill = '#fcba03'
          path.classList.remove('hidden')
          const textElement = svgElement.querySelector(`#Text${path.id}`)
          if (textElement) {
            textElement.style.display = ''
            const tspanElement = textElement.querySelector('tspan')
            if (tspanElement) {
              if (showTemperature) {
                const temperature = parseInt(device.temperature.celsius) / 10;
                tspanElement.textContent = `${temperature}°C`;
              } else {
                tspanElement.textContent = path.id;
              }
            }
          }
        } else {
          path.style.fill = 'white'
          const textElement = svgElement.querySelector(`#Text${path.id}`)
          if (textElement) {
            const tspanElement = textElement.querySelector('tspan')
            if (tspanElement) {
              tspanElement.textContent = path.id
            }
          }
        }
      })
    }
  }

  // Mouse Events
  function handleMouseOver(e) {
    if (e.target.tagName == 'path') {
      handleTooltip(e)
    }
  }
  function handleMouseOut(e) {
    const tooltip = document.querySelector('.tooltip')
    tooltip.classList.add('hidden')
  }

  function onClick(e) {
    if (e.target.tagName !== 'path') return

    const devices = get(deviceList)
    const device = devices.find((d) => d.heaterMap === e.target.id)
    if (device) {
      const deviceElement = document.getElementById(`device-${device.heaterMap}`)
      if (deviceElement) {
        deviceElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        deviceElement.focus({ preventScroll: true })
      }
      const inputField = deviceElement.querySelector('input[type="number"]')
      if (inputField) {
        inputField.focus()
      }
    }
  }

  // Keyboard Events
  function onKeyDown(e) {
    if (e.keyCode === 13) {
      onClick(e)
    }
  }
  function onFocusIn(e) {
    if (e.target.tagName == 'path') {
      handleTooltip(e)
    }
  }

  function handleFocusOut() {
    if (focusedElement !== document.activeElement) {
      const tooltip = document.querySelector('.tooltip')
      tooltip.classList.add('hidden')
    }
  }

  function loadSVG(svgName) {
    if (svgName === 'FloorplanLightMode') {
      svgContent = FloorplanLightMode;
    }else if (svgName === 'FloorplanDarkMode') {
      svgContent = FloorplanDarkMode;
    }
  }

  function changeSVG(svgName) {
    const paths = document.querySelectorAll('path')
    paths.forEach((path) => {
      path.removeEventListener('click', onClick)
    })

    // Load the selected SVG
    loadSVG(svgName)
  }

  function handleTooltip(e) {
    const rect = e.target.getBoundingClientRect()
    const tooltip = document.querySelector('.tooltip')
    const devices = get(deviceList)
    const device = devices.find((d) => d.heaterMap === e.target.id)
    let tooltipText = e.target.id

    if (device) {
      const measuredTemperature = parseInt(device.temperature.celsius) / 10
      const setTemperature = device.hkr && device.hkr.tsoll ? parseInt(device.hkr.tsoll) / 2 : 'N/A'
      tooltipText = `
        <div>
          <strong>${e.target.id}</strong><br>
          ${translations['targetTemperature']}:<br>${measuredTemperature}°C<br><br>
          ${translations['actualTemperature']}:<br>${setTemperature}°C
        </div>
      `
    }

    tooltip.style.top = `${rect.top - 50}px` // Adjust this to position the tooltip correctly
    tooltip.style.left = `${rect.left}px`
    tooltip.innerHTML = tooltipText
    tooltip.classList.remove('hidden')
    focusedElement = e.target
  }
</script>

<!-- Tooltip -->
<div class="tooltip hidden absolute bg-black text-white rounded p-1 dark:bg-gray-700">Tooltip Text</div>

<button class="bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 border border-gray-400 rounded shadow dark:bg-gray-700 dark:text-gray-100" on:click={toggleShowTemperature}>
  {showTemperature ? translations['showMapping'] : translations['showTemperature']}
</button>

<div
  class="interactive-svg"
  on:click={onClick}
  on:mouseover={handleMouseOver}
  on:mouseout={handleMouseOut}
  on:focusin={onFocusIn}
  on:focusout={handleFocusOut}
  on:keydown={onKeyDown}
>
  {@html svgContent}
</div>

<style>
  :global(path:focus) {
    outline: 3px solid rgb(252, 186, 3);
    outline-style: dashed;
  }
</style>
