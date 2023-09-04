<script>
  import { valueStore } from '../utils/valueStore';

  let strokeWidth = 2.5;

  function handleClick(value) {
    valueStore.set(value);
  }
</script>

<div
  class="fixed z-50 w-[60%] h-8 max-w-lg -translate-x-1/2 border rounded-full bottom-1 left-1/2 bg-gray-700 border-gray-600">
  <div class="grid h-full max-w-lg grid-cols-3 mx-auto">
    <button
      on:click={() => handleClick('Home')}
      data-tooltip-target="tooltip-home"
      type="button"
      class="inline-flex flex-col items-center justify-center px-5 rounded-l-full hover:bg-gray-800 group">
      <svg
        class="w-auto h-4 text-gray-400 group-hover:text-blue-500"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width={strokeWidth}
          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
      <span class="sr-only">Home</span>
    </button>
    <div
      id="tooltip-home"
      role="tooltip"
      class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 rounded-lg shadow-sm opacity-0 tooltip bg-gray-700">
      Home
      <div class="tooltip-arrow" data-popper-arrow />
    </div>
    <button
      on:click={() => handleClick('Recents')}
      data-tooltip-target="tooltip-recents"
      type="button"
      class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-800 group">
      <svg
        class="w-auto h-4 text-gray-400 group-hover:text-blue-500"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width={strokeWidth}
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="sr-only">Recents</span>
    </button>
    <div
      id="tooltip-recents"
      role="tooltip"
      class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 rounded-lg shadow-sm opacity-0 tooltip bg-gray-700">
      Recently Viewed
      <div class="tooltip-arrow" data-popper-arrow />
    </div>
    <button
      on:click={() => handleClick('Info')}
      data-tooltip-target="tooltip-info"
      type="button"
      class="inline-flex flex-col items-center justify-center px-5 rounded-r-full hover:bg-gray-800 group">
      <svg
        class="w-auto h-4 text-gray-400 group-hover:text-blue-500"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          stroke-width={strokeWidth}
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
      <span class="sr-only">Information</span>
    </button>
    <div
      id="tooltip-info"
      role="tooltip"
      class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 rounded-lg shadow-sm opacity-0 tooltip bg-gray-700">
      Information
      <div class="tooltip-arrow" data-popper-arrow />
    </div>
  </div>
</div>
