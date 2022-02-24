let infoJson = {};

document.addEventListener("DOMContentLoaded", function () {
  checkForContentScript();
  getInformationGithub();
  getInfoJson();
  document.getElementById("download-zip-button").addEventListener("click", sendDownloadZipRequest);
}, false);

/**
 * If receives the message saying that download is completed from content script,
 * then hide the loading animation for the download button.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message == "Popup download completed") {
    hideLoadingAnimation();
  }
});

/**
 * Try to communicate with content script to see if it is loaded.
 * If there is no response, then disable the download button.
 * If there is a response, then enable the download button.
 */
const checkForContentScript = () => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(
      activeTab.id,
      "Are you there?" ,
      function (response) {
        var lastError = chrome.runtime.lastError;
        if (lastError) {
          disableDownloadButton();
          return;
        }
        else if (response == "Content script received message") {
          console.log("Response received by content script");
          enableDownloadButton();
        }
      }
    );
  });
};

/**
 * Gets information from the json from on Github.
 */
const getInformationGithub = () => {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "https://raw.githubusercontent.com/tzoug/ThingiZIP/main/information.json", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        let response = JSON.parse(xhr.responseText);
        let version = response.latest_version;
        let information = response.info_msg;
        createVersionBadge(version);
        document.getElementById("information-text").innerText = information;
      };
    }
  };
  xhr.send();
}

/**
 * Creates a badge with the latest version of the extension.
 * Red = version out of date
 * Green = version up to date
 * @param {*} version 
 */
const createVersionBadge = (version) => {
  let manifestData = chrome.runtime.getManifest();
  if (version == manifestData.version) {
    let badge = document.createElement("span");
    badge.classList.add("badge");
    badge.classList.add("bg-success");
    badge.innerText = "v" + version;
    document.getElementById("version-container").appendChild(badge);
  }
  else{
    let badge = document.createElement("span");
    badge.classList.add("badge");
    badge.classList.add("bg-danger");
    badge.innerText = "v" + version;
    document.getElementById("version-container").appendChild(badge);
  }
}

/**
 * Send a message to content script asking it to download the zip file.
 * Then show the loading animation.
 */
const sendDownloadZipRequest = () => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(
      activeTab.id,
      "Popup wishes to download" ,
      function (response) {
        var lastError = chrome.runtime.lastError;
        if (lastError) {
          // 'Could not establish connection. Receiving end does not exist.'
          disableDownloadButton();
        }
        else if (response == "Content script received message") {
          showLoadingAnimation();
        }
      }
    );
  });
};

/**
 * Get the json containing the info of the last thingiverse page opened.
 * If there's no json then display a message to the user saying they must visit a thingiverse page.
 */
const getInfoJson = () => {
  chrome.storage.local.get("infoJson", function (data) {
    if (data.infoJson) {
      infoJson = data.infoJson;
      document.getElementById("no-info-card").style.display = "none";
      document.getElementById("info-card").style.display = "flex";
      console.log("Info json found");
      showPreview(infoJson);
    } else {
      document.getElementById("info-card").style.display = "none";
      document.getElementById("no-info-card").style.display = "flex";
      chrome.runtime.sendMessage("Please create default settings");
      console.log("No infoJson found");
    }
  });
};

/**
 * Display all the values from the info json in the popup.
 */
const showPreview = (infoJson) => {
  let addedDate = infoJson.added_date;
  let readableAddedDate = new Date(addedDate).toDateString();

  // Add Images
  document.getElementById("thing-thumbnail").src = infoJson.thumbnail;
  document.getElementById("creator-avatar").src = infoJson.creator_img;

  // Add text and remove placeholders
  let thingName = document.getElementById("thing-name");
  thingName.classList.remove("placeholder");
  thingName.textContent = infoJson.name;

  let creator = document.getElementById("thing-creator");
  creator.classList.remove("placeholder");
  creator.textContent = infoJson.creator_name;
  creator.href = infoJson.creator_link;

  let displayDate = document.getElementById("added-date");
  displayDate.classList.remove("placeholder");
  displayDate.textContent = readableAddedDate;

  document.getElementById("likes-count").textContent = infoJson.likes;
  document.getElementById("comments-count").textContent = infoJson.comments;
  document.getElementById("collections-count").textContent = infoJson.collections;

  document.getElementById("images-count").innerHTML = `<i class="bi bi-file-earmark-image"></i> Images: ${infoJson.image_count}`;
  document.getElementById("files-count").innerHTML = `<i class="bi bi-file-earmark"></i> Files: ${infoJson.file_count}`;

  // Buttons
  let thingiverseButton = document.getElementById("thingiverse-link-button");
  thingiverseButton.classList.remove("disabled");
  thingiverseButton.classList.remove("placeholder");
  thingiverseButton.href = infoJson.page_link;
  thingiverseButton.textContent = "Visit Page";

  let downloadZipButton = document.getElementById("download-zip-button");
  downloadZipButton.classList.remove("disabled");
  downloadZipButton.classList.remove("placeholder");
  downloadZipButton.textContent = "Download ZIP";
};

/**
 * Show an animation while the zip file is being downloaded.
 * Disables the download button and adds a rotating spinner.
 */
const showLoadingAnimation = () => {
  let downloadButton = document.getElementById("download-zip-button");
  if (!downloadButton.classList.contains("disabled")) {
    downloadButton.classList.add("disabled");
  }
  downloadButton.textContent = "";
  let animation = document.createElement("div");
  animation.id = "loading-animation";
  animation.classList.add("spinner-border");
  animation.classList.add("spinner-border-sm");
  animation.setAttribute("role","status");
  downloadButton.appendChild(animation);
};

/**
 * Hides the loading animation when the zip file was being downloaded.
 */
const hideLoadingAnimation = () => {
  let downloadButton = document.getElementById("download-zip-button");
  if (downloadButton.classList.contains("placeholder")) {
    downloadButton.classList.remove("placeholder");
  }
  if (downloadButton.classList.contains("disabled")) {
    downloadButton.classList.remove("disabled");
  }
  
  let animation = document.getElementById("loading-animation");
  animation.remove();
  downloadButton.textContent = "Download ZIP";
};

/**
 * Allows the button to be clickable after it was disbaled for the zip download.
 */
const enableDownloadButton = () => {
  let downloadButton = document.getElementById("download-zip-button");
  let downloadTooltip = document.getElementById("download-tooltip");

  downloadTooltip.setAttribute("title", "");
  if (downloadButton.classList.contains("disabled")) {
    downloadButton.classList.remove("disabled");
  }
  if (downloadButton.classList.contains("placeholder")) {
    downloadButton.classList.remove("placeholder");
  }
};

/**
 * Restricts the clickability of the button until the zip file is downloaded.
 */
const disableDownloadButton = () => {
  let downloadButton = document.getElementById("download-zip-button");
  let downloadTooltip = document.getElementById("download-tooltip");

  downloadTooltip.setAttribute(
    "title",
    "It seems like you are not on a Thingiverse page"
  );
  if (!downloadButton.classList.contains("disabled")) {
    downloadButton.classList.add("disabled");
  }
  if (!downloadButton.classList.contains("placeholder")) {
    downloadButton.classList.add("placeholder");
  }
  if (
    document.getElementById("download-tooltip").style.visibility == "hidden"
  ) {
    document.getElementById("download-tooltip").style.visibility = "visible";
    downloadButton.style.visibility = "visible";
  }
};
