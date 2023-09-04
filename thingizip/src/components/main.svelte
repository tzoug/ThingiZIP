<script lang="ts">
  import Heading from './heading.svelte';
  import Body from './body.svelte';
  import Navbar from './navbar.svelte';
</script>

<div class="w-[22rem] h-[36rem] max-w-lg border shadow caret-transparent bg-gray-800 border-gray-700">
  <Heading />
  <div class="p-4 mb-6">
    <Body />
    <Navbar />
  </div>
</div>
