<script lang="ts">
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'

  export let translations
  export let lang
  export let userId

  let rooms: string[] = []
  let roomName = ''
  let initialRoomName = ''
  let hasChanged = false

  onMount(() => {
    loadInitialRoomName()
    loadAvailableRooms()
  })

  const loadAvailableRooms = async () => {
    try {
      const mapsResponse = await fetch('http://localhost:3000/device/device-map', {
        method: 'GET',
      })
      const maps = await mapsResponse.json()
      const roomsHeaterMap: { room: string; heater: string }[] = maps.roomsHeatersMap
      rooms = Array.from(new Set(roomsHeaterMap.map((roomHeater) => roomHeater.room)))
    } catch (error) {
      console.error('Error loading available rooms:', error)
    }
  }

  const loadInitialRoomName = async () => {
    try {
      const response = await fetch(`http://localhost:3000/user/${userId}`, {
        method: 'GET',
      })

      if (!response.ok) throw new Error('Failed to load settings')

      const settings = await response.json()
      initialRoomName = settings.room ?? initialRoomName
      roomName = initialRoomName
    } catch (error) {
      console.error('Error loading room name:', error)
    }
  }

  const updateDbSettings = async (userId: string, roomName: string) => {
    try {
      const response = await fetch('http://localhost:3000/user/room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, room: roomName }),
      })

      if (!response.ok) throw new Error('Failed to update room name setting')

      hasChanged = false
      initialRoomName = roomName
    } catch (error) {
      console.error('Error updating room name setting:', error)
    }
  }

  const handleInputChange = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    roomName = value
    hasChanged = value !== initialRoomName
  }

  const saveRoomName = () => {
    updateDbSettings(userId, roomName)
  }
</script>

<div class="settings-container">
  <div class="setting">
    <h1 class="setting-title mr">{translations['roomSetting']}</h1>
  </div>
  <p class="setting-description">{translations['roomSettingDescription']}</p>
  <div class="my-8">
    <select
      class="appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-w-24 mr-2"
      id="room"
      bind:value={roomName}
      on:input={handleInputChange}
    >
      {#each rooms as r}
        <option value={r}>{r}</option>
      {/each}
    </select>
    <button
      on:click={saveRoomName}
      class="save-button rounded-full"
      transition:fly={{ y: 20, duration: 300 }}
      class:disabled={!hasChanged}
    >
      {translations['saveRoomName']}
    </button>
  </div>
</div>

<style>
  .settings-container {
    max-width: 100%;
    margin: 0;
  }

  .setting {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .setting-title {
    flex: 1;
    margin: 0;
    font-size: 24px;
    font-weight: bold;
  }

  .setting-description {
    flex: 2;
    margin: 0 1.5em 0 0; /* top right bottom left */
    font-size: 16px;
  }

  .save-button {
    align-self: flex-start;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 500;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .save-button.disabled {
    background-color: #c0c0c0;
    cursor: not-allowed;
  }

  .save-button:hover:not(.disabled) {
    background-color: #0056b3;
  }
</style>
