<script lang="ts">
  import Recent from './recent.svelte';
  import { getRecentsFromStorage } from '../utils/helpers';

  let recents;
  getRecentsFromStorage().then((res) => {
    console.log(res);
    recents = res;
  });
</script>

{#if recents != undefined}
  {#each recents as recent}
    <Recent
      name={recent['name']}
      thumbnail={recent['thumbnail']}
      creatorName={recent['creator']['name']}
      detailsTimestamp={recent['timestamp']}
      link={recent['public_url']} />
  {/each}
{/if}
