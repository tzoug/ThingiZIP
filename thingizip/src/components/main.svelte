<script>
    import Heading from './heading.svelte';
    import Body from './body.svelte';
    import Navbar from './navbar.svelte';
    const detailsKey = "thingiverseDetails";
    const pageKey = "thingizip_target_page";

    async function getFromStorage(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(key, resolve);
        })
        .then(result => {
            if (key == null) return result;
            else return result[key];
        });
    }
</script>

<div class="min-w-[22rem] max-w-lg bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700">
    <Heading/>
    <Body/>
    <Navbar/>        
</div>