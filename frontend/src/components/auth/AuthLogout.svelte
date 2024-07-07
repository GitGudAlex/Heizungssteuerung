<script lang="ts">
  // props for the component
  export let translations: { [key: string]: string }
  export let lang: string

  const handleLogout = () => {
    // Remove the auth cookie
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    // Redirect
    window.location.href = `/${lang}/login`

    // clear local storage
    localStorage.removeItem('sepiaMode')
    localStorage.removeItem('fontSize')
    localStorage.removeItem('lineHeight')
    localStorage.removeItem('settingsLoaded')
  }
</script>

<div
  class="settings-container bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300"
>
  <div class="setting">
    <h2 class="setting-title mr">{translations['logout']}</h2>
  </div>
  <p class="setting-description">{translations['logoutDescription']}</p>
  <button
    class="rounded-full mt-4 px-4 py-2 bg-red-800 text-white hover:bg-red-500 transition duration-300 button-font-size"
    on:click={handleLogout}
  >
    {translations['logout']}
  </button>
</div>

<style>
  .button-font-size {
    font-size: calc(16px + var(--add-font-size));
    /*transition: font-size 0.5s ease;*/
  }
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
</style>
