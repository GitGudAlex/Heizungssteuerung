<script lang="ts">
  import Button from '../general/Button.svelte'

  export let translations: { [key: string]: string }

  let username: string = ''
  let password: string = ''
  let invitationCode: string = ''

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, invitationCode }),
      })

      if (response.ok) {
        alert('Sign up successful')
      } else {
        const errorMessage = await response.json()
        alert('Sign up failed. ' + errorMessage.message)
      }
    } catch (error: any) {
      console.error('Sign up failed: ', error.message)
    }
  }

  const getUrlParameter = (name: string): string | null => {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
    const results = regex.exec(window.location.search)
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
  }

  // Check URL parameters when the script is executed
  const codeFromURL = getUrlParameter('invitationCode')
  if (codeFromURL) {
    invitationCode = codeFromURL
  }
</script>

<div class="login-container">
  <form on:submit|preventDefault={handleSignUp}>
    <label class="input input-bordered flex items-center gap-2 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
        <path
          d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
        />
      </svg>
      <input
        type="text"
        class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-60"
        id="username"
        placeholder={translations['username']}
        bind:value={username}
      />
    </label>
    <label class="input input-bordered flex items-center gap-2 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
        <path
          fill-rule="evenodd"
          d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
          clip-rule="evenodd"
        />
      </svg>
      <input
        type="password"
        class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-60"
        id="password"
        placeholder={translations['password']}
        bind:value={password}
      />
    </label>
    <label class="input input-bordered flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 opacity-70">
        <path
          d="M2.038 5.61A2.01 2.01 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-.12-.01-.238-.03-.352l-.866.65-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z"
        />
        <path
          d="M20.677 4.117A1.996 1.996 0 0 0 20 4H4c-.225 0-.44.037-.642.105l.758.607L12 10.742 19.9 4.7l.777-.583Z"
        />
      </svg>
      <input
        type="text"
        class="rounded-full px-4 py-2 border border-gray-300 focus:border-blue-500 outline-none bg-transparent w-60"
        id="invitationCode"
        placeholder={translations['invitationCode']}
        bind:value={invitationCode}
      />
    </label>

    <Button text={translations['register']} type="submit" />
  </form>
</div>
