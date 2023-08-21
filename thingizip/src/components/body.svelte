<script>
    import Welcome from './welcome.svelte';
    import ThingDetails from './thingDetails.svelte';
</script>

<div class="p-4 mb-6">
    <!-- If on home page -->
    <ThingDetails/>
    <!-- {#await getFromStorage(detailsKey)}
        <h4 class="text-lg text-white">Checking for Thingiverse details.</h4>
    {:then details}
        {#if details != undefined}        
            <p>There's something</p>
        {:else}        
            <Welcome/>
        {/if}
    {/await} -->
</div>