<img src="images/ThingiZIP.png" alt="drawing" width="50"/>

# ThingiZIP [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

ThingiZIP is a web browser extension that makes it easy to download images and files from Thingiverse™. This extension creates an interactive popup in the toolbar of your browser. This project utilizes the Thingiverse™ API. Please note that if the Thingiverse™ API changes, the performance and/or functionality of this extension may be impacted.

## Download

[![Chrome](https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white)](https://chrome.google.com/webstore/detail/thingizip/maonfmeilcpjfdipacfehiidjngcoama)

[![Firefox](https://img.shields.io/badge/Firefox-FF7139?style=for-the-badge&logo=Firefox-Browser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/thingizip/)

[![GithubRelease](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/tzoug/ThingiZIP/releases)

## Usage

To download a ZIP file, you must be on a valid Thingiverse™ model page.  
Here is an example of the structure of a valid page: `https://www.thingiverse.com/thing:1234567`  

As you can see, a valid page contains a series of numbers preceded by `thing:`  
It doesn't matter if there's anything after the numbers.  
For example, `https://www.thingiverse.com/thing:1234567/files` is also a valid page.  

### Home Page

This is where you will be able to download and view information about the last Thingiverse page you visited.

You can either:

- Download Files: only download the files (`.stl`, `.obj`, `.gcode`... )
- Download All: download the files + images + `details.txt`

<img src="images/thingizip-main.png" alt="drawing" width="500"/>

### Recents

This is where you will see a history of the previous Thingiverse page that you visited.

Note that information only gets added to the recents whenever you open the extension on a Thingiverse page.
In other words, if you visit a number of pages without opening the extension popup, they will not be added to the recents.

<img src="images/thingizip-recent-page.jpg" alt="drawing" width="500"/>

## Issues

If you have any issues, feel free to create a GitHub issue if it hasn't already been addressed.

## Contributing

Contributions are always welcome!

## Technologies used

![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)

![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

[Heroicons](https://heroicons.com/)

[JSZip](https://stuk.github.io/jszip/)

[JSZip Utils](https://github.com/Stuk/jszip-utils)

[FileSaver](https://github.com/eligrey/FileSaver.js/)