# Remove existing files
cd output/
rm -rf *

# Create chrome extension package
cd ../chrome
7z a -tzip -mx9 ../output/ThingiZIP-chrome.crx *
7z a -tzip -mx9 ../output/ThingiZIP-chrome.zip *

# Create firefox extension package
cd ../firefox
7z a -tzip -mx9 ../output/ThingiZIP-firefox.xpi *
7z a -tzip -mx9 ../output/ThingiZIP-firefox.zip *
