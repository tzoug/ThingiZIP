<script lang="ts">    
    export let currentVersion: string;
    currentVersion = chrome.runtime.getManifest().version;
</script>

<a href="https://github.com/tzoug/ThingiZIP/releases" target="_blank" class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-sky-600 dark:text-stone-50">
    v{currentVersion}
</a>


