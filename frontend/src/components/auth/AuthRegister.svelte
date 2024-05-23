<script lang="ts">
  export let translations: { [key: string]: string }
  export let lang: string

  let username: string = ''
  let password: string = ''
  let invitationCode: string = ''
  let errorMessage: string = ''
  let signUpSuccess: boolean = false

  const handleSignUp = async () => {
    errorMessage = ''
    if (password.length < 7) {
      console.log('Password too short')
      errorMessage = translations['passwordLengthError']
      return
    }

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, invitationCode }),
      })

      if (response.ok) {
        signUpSuccess = true
        window.location.href = `/${lang}/login`
      } else {
        console.log('Sign up failed: ', response.status)
        if (response.status === 400) {
          errorMessage = translations['invalidInviteCode']
        } else if (response.status === 409) {
          errorMessage = translations['usernameTakenError']
        } else {
          errorMessage = translations['genericError']
        }
      }
    } catch (error: any) {
      errorMessage = translations['internalError']
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

<div class="flex h-screen">
  <form on:submit|preventDefault={handleSignUp} class="pb-8 mb-4 w-full max-w-md">
    {#if errorMessage.length > 0}
      <p class="text-red-500 mb-4">{errorMessage}</p>
    {/if}
    <div class="mb-4">
      <label class="block text-sm font-bold mb-2" for="username">{translations['username']}</label>
      <input
        class="appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="username"
        type="text"
        placeholder={translations['username']}
        bind:value={username}
      />
    </div>
    <div class="mb-4">
      <label class="block text-sm font-bold mb-2" for="password">{translations['password']}</label>
      <input
        class="appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="password"
        type="password"
        placeholder={translations['password']}
        bind:value={password}
      />
    </div>
    <div class="mb-6">
      <label class="block text-sm font-bold mb-2" for="invitationCode">{translations['invitationCode']}</label>
      <input
        class="appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="invitationCode"
        type="text"
        placeholder={translations['invitationCode']}
        bind:value={invitationCode}
      />
    </div>
    <div class="flex items-center justify-between mb-6">
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full"
      >
        {translations['register']}
      </button>
    </div>
    <a href={`/${lang}/login`} class="text-blue-500 hover:underline">{translations['loginNow']}</a>
  </form>
</div>
