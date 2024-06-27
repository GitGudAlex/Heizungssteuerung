<script>
  import { fade, fly } from 'svelte/transition'
  export let isLoading = false
</script>

{#if isLoading}
  <div class="lds-ellipsis" in:fade={{ duration: 200 }} out:fly={{ y: 20, duration: 300 }}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
{/if}

<style>
  .lds-ellipsis,
  .lds-ellipsis div {
    box-sizing: border-box;
  }
  .lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 40px;
    height: 40px;
  }
  .lds-ellipsis div {
    position: absolute;
    top: 16px;
    width: 6.67px;
    height: 6.67px;
    border-radius: 50%;
    background: currentColor;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  .lds-ellipsis div:nth-child(1) {
    left: 4px;
    animation: lds-ellipsis1 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(2) {
    left: 4px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(3) {
    left: 16px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(4) {
    left: 28px;
    animation: lds-ellipsis3 0.6s infinite;
  }
  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(12px, 0);
    }
  }
</style>
