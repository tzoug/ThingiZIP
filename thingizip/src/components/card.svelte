<script>
    import Heading from './heading.svelte';
    import Welcome from './welcome.svelte';

    let val = true;
</script>

<div class="min-w-[22rem] max-w-lg bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700">
    <Heading/>
    
    {#if val}<Welcome/>{/if}
</div>