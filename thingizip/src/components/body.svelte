<script>
  import Welcome from './welcome.svelte';
  import ThingDetails from './thingDetails.svelte';
  import { collectDetails } from './collectDetails';
  let isFirstLaunch = undefined;

  checkForFirstLaunch();
  function checkForFirstLaunch() {
    collectDetails().then((value) => {
      console.log(value);
      if (value != null && value != undefined) {
        isFirstLaunch = false;
      } else {
        isFirstLaunch = true;
      }
    });
  }
</script>

<div class="p-4 mb-6">
  {#if isFirstLaunch}
    <Welcome />
  {:else}
    <ThingDetails />
  {/if}
</div>
