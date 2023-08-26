<script lang="ts">
  import Recent from './recent.svelte';
  import { getRecentsFromStorage } from '../utils/helpers';

  let recents: Object[];
  getRecentsFromStorage().then((res) => {
    console.log(res);
    recents = res;
  });
</script>

{#if recents != undefined && recents.length != 0}
  <div class="grid grid-cols-1 gap-4">
    {#each recents as recent}
      <Recent
        name={recent['name']}
        thumbnail={recent['thumbnail']}
        creatorName={recent['creator']['name']}
        detailsTimestamp={recent['timestamp']}
        link={recent['public_url']} />
    {/each}
  </div>
{:else}
  <h5 class="text-white">No recently viewed pages</h5>
{/if}
