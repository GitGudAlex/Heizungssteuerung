<script lang="ts">
  import { Button } from 'flowbite-svelte'
  import ButtonGroup from 'flowbite-svelte/ButtonGroup.svelte'
  import { onMount } from 'svelte'

  export let translations
  export let userId

  let rooms: string[] = []
  let roomName = ''
  let initialRoomName = 'n001'
  let hasChanged = false
  let selectedRoom = ''

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
      selectedRoom = initialRoomName
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
      selectedRoom = roomName
    } catch (error) {
      console.error('Error updating room name setting:', error)
    }
  }

  const saveRoomName = () => {
    updateDbSettings(userId, roomName)
  }

  const handleButtonClick = (room: string) => {
    selectedRoom = room
    roomName = room
    hasChanged = room !== initialRoomName
    saveRoomName()
  }
</script>

<div class="settings-container">
  <div class="setting">
    <h1 class="setting-title mr">{translations['roomSetting']}</h1>
  </div>
  <p class="setting-description text-space">{translations['roomSettingDescription']}</p>
  <div class="my-8">
    <ButtonGroup>
      {#each rooms as room}
        <Button outline checked={room === selectedRoom} color="dark" on:click={() => handleButtonClick(room)}>
          {room}
        </Button>
      {/each}
    </ButtonGroup>
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
    font-size: calc(24px + var(--add-font-size));
    /*transition: font-size 0.5s ease;*/
    font-weight: bold;
  }

  .setting-description {
    flex: 2;
    margin: 0 1.5em 0 0; /* top right bottom left */
    font-size: calc(16px + var(--add-font-size));
    /*transition: font-size 0.5s ease;*/
  }

  .text-space {
    line-height: var(--line-height);
    transition: line-height 0.5s ease;
  }
</style>
