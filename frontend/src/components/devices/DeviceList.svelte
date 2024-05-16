<script lang="ts">
  import { onMount } from 'svelte'

  let deviceList: { name: string }[] = []

  const getDevices = async () => {
    try {
      const response = await fetch('http://localhost:3000/device', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to retrieve devices: ' + response.statusText)
      }

      const data = await response.json()

      if (!data.devicelist || !Array.isArray(data.devicelist.device)) {
        throw new Error('Invalid response format: devicelist or device property not found or not an array')
      }

      deviceList = data.devicelist.device
      console.log('Devices:', deviceList)
    } catch (error) {
      console.error('Error retrieving devices:', error)
    }
  }

  onMount(() => {
    getDevices()
  })
</script>

<div>
  <h1>Device List</h1>
  {#if deviceList != null}
    <ul>
      {#each deviceList as device}
        <li>{device.name}</li>
      {/each}
    </ul>
  {:else}
    <p>No devices</p>
  {/if}
</div>
