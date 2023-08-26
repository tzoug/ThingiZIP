<script lang="ts">
  export let currentVersion: string;
  currentVersion = chrome.runtime.getManifest().version;
</script>

<a
  href="https://github.com/tzoug/ThingiZIP/releases"
  target="_blank"
  class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-sky-600 text-stone-50">
  v{currentVersion}
</a>
