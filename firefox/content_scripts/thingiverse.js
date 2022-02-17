var detailsJson = {};
var imagesJson = {};
var filesJson = {};
var userPrefs = {};

window.onload = function () {
  storeJson();
  checkForUserSetting();
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request == "Website download completed") {
    hideLoading();
  }
  else if (request == "Popup wishes to download") {
    sendResponse("Content script received message");
    console.log("Popup wants to download");
    downloadZIP("popup");
  }
  else if (request == "Are you there?") {
    sendResponse("Content script received message");
    console.log("Popup is asking if content script is here");
  }
  else if (request == "Default settings created and saved") {
    console.log("Default settings created and saved");
    checkForUserSetting();
  }
});

/** Send message to popup when the zip download is complete */
const sendDownloadCompleteToPopup = () =>{
  chrome.runtime.sendMessage({ message: "Popup download completed" }, console.log("Telling popup download is complete"));
}

/**
 * Checks if the userSettings have been saved in the local storage.
 * If not, then send a message to the background script to create the default settings.
 * If they have, then load the settings from the local storage.
 * Then verify if the cloned download button setting is enabled. If yes then show it on the page.
 */
const checkForUserSetting = () => {
  chrome.storage.local.get("userSettings", function (data) {
    if (data.userSettings == undefined) {
      console.log("No user settings found. Asking background to create default settings");
      chrome.runtime.sendMessage("Please create default settings");
    } 
    else {
      userPrefs = data.userSettings;
      console.log(userPrefs);
      console.log("User settings found");
      if (data.userSettings.showDownloadOnWebsite == true) {
        console.log("Download button is enabled by user");
        waitForDefaultDownloadButton();
      }
      else{
        console.log("Download button is disabled by user");
      }
    }
  });
};

/**
 * Stores the json data of the api data in the local storage.
 * This data can be accessed by the extension popup and the thingiverse website. In orded to download a zip file.
 */
const storeJson = () => {
  let thingId = getThingId();
  let thingDetails = makeAPICall(thingId, "");
  let thingImages = makeAPICall(thingId, "images");
  let thingFiles = makeAPICall(thingId, "files");
  
  // Promise.all([thingDetails, thingImages, thingFiles]).then(function (values) {
  //   detailsJson = values[0];
  //   imagesJson = values[1];
  //   filesJson = values[2];

  //   chrome.storage.local.set({'thingDetails': detailsJson});
  //   chrome.storage.local.set({'thingImages': imagesJson});
  //   chrome.storage.local.set({'thingFiles': filesJson});
  //   saveInfoJson();
  // });  
}

/**
 * Save a basic json file with the info needed to display on the extension popup.
 */
const saveInfoJson = () => {
  let infoJson = {
    "id": detailsJson.id,
    "name": detailsJson.name,
    "creator_name": detailsJson.creator.name,
    "creator_img": detailsJson.creator.thumbnail,
    "creator_link": detailsJson.creator.public_url,
    "added_date": detailsJson.added,
    "thumbnail": imagesJson[0]["sizes"][0]["url"],
    "page_link": detailsJson.public_url,
    "likes": detailsJson["like_count"],
    "comments": detailsJson["comment_count"],
    "collections": detailsJson["collect_count"],
    "file_count": filesJson.length,
    "image_count": imagesJson.length,
  };
  chrome.storage.local.set({'infoJson': infoJson}, function() {
    console.log('Info Json saved');
  });
}

const waitForDefaultDownloadButton = () => {
  let checkForButton = setInterval(() => {
    if(document.getElementsByClassName("sidebar-zip-button")[0] == undefined){
      if (document.getElementsByClassName("SidebarMenu__download--3Vqb7")[0] != undefined) {
        cloneDownloadButton();
        return;
      }
    }
  } , 500);
};

/**
 * Create download button on the thingiverse website.
 * This button will be a clone of the original download button.
 * Except with the users defined settings, such as: text, color and hover color.
 */
const cloneDownloadButton = () => {
  // -- Get the number of buttons in the sidebar
  let numberOfDownloadButtons = document.getElementsByClassName("SidebarMenu__download--3Vqb7").length;

  // -- Get the parent div that contains the contents of the existing download button
  let parentDiv = document.getElementsByClassName("SidebarMenu__download--3Vqb7")[numberOfDownloadButtons - 1]
  .parentNode.cloneNode(true);
  parentDiv.classList.add("sidebar-zip-button");

  // -- Add class to contents of the clone
  let buttonContainer = parentDiv
  .childNodes[0] // SidebarMenu__download--3Vqb7
  .childNodes[0] // .button button-primary
  buttonContainer.classList.add("zip-button-container");
  buttonContainer.id = "zip-container";

  // -- Add css to button (color and hover color). Can be changed in the settings.
  document.head.insertAdjacentHTML('beforeend', `<style>#zip-container{background-color:${userPrefs.buttonColor} !important;</style>`);
  document.head.insertAdjacentHTML('beforeend', `<style>#zip-container:hover{background-color:${userPrefs.buttonHoverColor} !important;</style>`);

  let iconAndText = buttonContainer.childNodes[0];
  iconAndText.classList.add("zip-icon-text");
  
  // -- Add text to button (Default: Download ZIP). Can be changed in the settings
  let buttonText = iconAndText.childNodes[0];
  buttonText.textContent = userPrefs.buttonText;
  
  // -- Add the clone to where the original download button is
  document
  .querySelector(".SidebarMenu__sideMenuTop--3xCYh")
  .appendChild(parentDiv);

  console.log("Cloned download button");

  defineEvents();
  createAndHideLoadingAnimation();
};

/**
 * Define the events when the download button is clicked from the thingiverse website.
 */
const defineEvents = () => {
  document
    .getElementsByClassName("sidebar-zip-button")[0]
    .addEventListener("click", function (event) {
      if (!(detailsJson == undefined || imagesJson == undefined || filesJson == undefined)) {
      showLoading();
      downloadZIP("website");
      }
      else{
        console.log("Not all json files are loaded. Getting them...");
        storeJson();
        setTimeout(() => {
          showLoading() 
          downloadZIP()
        } , 1000);

      }
    });
};

/**
 * Make a call to thingiverse api, in order to get the data needed to download the zip file.
 * @param {*} thingId is the id of the thing to download. Can be found in the url of the thingiverse website (Followed by "thing:").
 * @param {*} endpoint represents the endpoint of the api call. Can be "", "images" or "files".
 * @returns a promise with the json data of the api call.
 */
const makeAPICall = (thingId, endpoint) => {
  let token = "201f5af321613bba4669214ec393d6de"; // this is a read-only token from Thingiverse
  let url;
  if (endpoint == "") {
    url = `https://api.thingiverse.com/things/${thingId}`;
  } else if (endpoint == "files") {
    url = `https://api.thingiverse.com/things/${thingId}/files`;
  } else if (endpoint == "images") {
    url = `https://api.thingiverse.com/things/${thingId}/images`;
  }
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.setRequestHeader("Authorization", "Bearer 56edfc79ecf25922b98202dd79a291aa")
  xhr.responseType = 'text';
  
  xhr.onload = function () {
      if (xhr.readyState === xhr.DONE) {
          if (xhr.status === 200) {
              if (endpoint == ""){
                chrome.storage.local.set({'thingDetails': detailsJson});
                detailsJson = JSON.parse(xhr.responseText);
              }
              else if (endpoint == "images"){
                chrome.storage.local.set({'thingImages': imagesJson});
                  imagesJson = JSON.parse(xhr.responseText);
              }
              else if (endpoint == "files"){
                chrome.storage.local.set({'thingFiles': filesJson});
                filesJson = JSON.parse(xhr.responseText);
                setTimeout(() => { saveInfoJson(); } , 1000);
              }
          }
      }
  };
  xhr.send(null);
};

/**
 * Gets the id from the url of the thingiverse website using regex.
 * @returns the id of the thing to download.
 */
const getThingId = () => {
  let stringURL = document.URL;
  let re = /https\:\/\/www\.thingiverse\.com\/thing\:(\d+)/;
  let matches = stringURL.match(re);
  const thingId = matches[1];
  return thingId;
};

/**
 * Download the zip file. Store all the data needed, create subdirectories and files, then zip them.
 * @param {*} whoClicked represents the source of the download button. Can be "website" or "popup".
 */
const downloadZIP = (whoClicked) => {
  let modelName = detailsJson["name"].trim();
  var zip = new JSZip();

  //-- Loop through images and add them to Images directory in zip
  for (const image of imagesJson) {
    let filename = image["name"];
    let downloadUrl = image["sizes"][12]["url"];
    zip.file(`Images/${filename}`, urlToPromise(downloadUrl), { binary: true });
  }

  // -- Loop through stl files and add them to Files directory in zip
  for (const file of filesJson) {
    let filename = file["name"];
    let downloadUrl = file["public_url"];
    zip.file(`Files/${filename}`, urlToPromise(downloadUrl), { binary: true });
  }

  zip.file("Info.txt", getInfoFromDetails(detailsJson));

  function urlToPromise(url) {
    return new Promise(function (resolve, reject) {
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) {
          throw err;
        }
        else{
          resolve(data);
        }
      });
    });
  }

  // -- Generate de zip file
  try{
    zip.generateAsync({ type: "blob" }).then(function callback(blob) {
      saveAs(blob, `${modelName}.zip`);
      if (whoClicked === "popup") {
        sendDownloadCompleteToPopup();
      }
      else if (whoClicked === "website") {
        hideLoading();
      }
    });
  }
  catch(error){
    console.log(error);
  }
}

/**
 * Generate the string of text needed in the Info.txt file that will be in the zip file.
 * @returns a string with the info needed to create the Info.txt file.
 */
const getInfoFromDetails = () => {
  let modelName = detailsJson["name"];
  let linkToModel = detailsJson["public_url"];
  let likesCount = `Likes: ${detailsJson["like_count"]}`;
  let collectCount = `Collections: ${detailsJson["collect_count"]}`;
  let commentCount = `Comments: ${detailsJson["comment_count"]}`;
  let downloadCount = `Downloads: ${detailsJson["download_count"]}`;
  let metadata = `${likesCount}\n${collectCount}\n${commentCount}\n${downloadCount}\n`;

  let fullDetails = detailsJson['details'];
  let dom = new DOMParser().parseFromString(fullDetails, "text/html");
  fullDetails = dom.body.textContent;
  fullDetails = fullDetails.replace(/<\/?[^>]+(>|$)/g, "");
  fullDetails = fullDetails.replace( /\s\s+/g, '\n');

  let fullInfo = `Name: ${modelName}\n${linkToModel}\n\n${metadata}\n\n${fullDetails}`;
  return fullInfo;
};


/**
 * Add the loading animation to the page. Then hide it for later use.
 */
const createAndHideLoadingAnimation = () => {
  let zipButtonContainer = document.getElementsByClassName("zip-button-container")[0];

  // -- Create loading animation div with elements inside
  let bouncingBallDiv = document.createElement("div");
  bouncingBallDiv.classList.add("bouncing-ball-download");
  for (let index = 1; index < 4; index++) {
    let ball = document.createElement("div");
    ball.classList.add("circle");
    ball.setAttribute("id", `ball-${index}`);      
    bouncingBallDiv.appendChild(ball);
  }

  // -- Add and hide the loading animation to the button
  zipButtonContainer.appendChild(bouncingBallDiv);
  bouncingBallDiv.style.display = "none";
};

/**
 * Show the loading animation when the download button is clicked.
 */
const showLoading = () => {
  let bouncingBallDiv = document.getElementsByClassName("bouncing-ball-download")[0];
  let zipIconText = document.getElementsByClassName("zip-icon-text")[0];
  
  zipIconText.style.display = "none";
  bouncingBallDiv.style.display = "block";
};

/**
 * Hide the loading animation when the download has been completed.
 */
const hideLoading = () => {
  let bouncingBallDiv = document.getElementsByClassName("bouncing-ball-download")[0];
  let zipIconText = document.getElementsByClassName("zip-icon-text")[0];
  
  bouncingBallDiv.style.display = "none";
  zipIconText.style.display = "block";
};

