document.addEventListener("DOMContentLoaded", function () {
    readFromSettings();
    document.getElementById("show-download-button-switch").addEventListener("click", checkForAdditionalSettings);
    document.getElementById("settings-save-button").addEventListener("click", saveUserPreferences);
  }, false);
  
/**
 *  Listens for messages
*/
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request == "Default settings created and saved") {
        readFromSettings();
    }
});

/**
 *  Reads the user settings from the storage.local
 *  If the user settings are not found then ask background script to create default settings
 *  If the settings are found then show the correct settings
 */
const readFromSettings = () => {
    chrome.storage.local.get("userSettings", function (result) {
        if (!result.userSettings) {
            console.log("No settings found. Asking background to create default settings.");
            chrome.runtime.sendMessage("Please create default settings");
        }
        else {
            showCorrectSettings(result);
            checkForAdditionalSettings();
        }
    });
};

/**
 *  Checks the value of the showDownloadOnWebsite switch.
 *  If the switch is checked then more button settings are shown. 
 */
const checkForAdditionalSettings = () => {
    let additionalSettings = document.getElementsByClassName("additional-download-button-settings")[0];
    let toggleButton = document.getElementById("show-download-button-switch");
    if(toggleButton.checked) {
        additionalSettings.style.display = "block";
    }
    else{
        additionalSettings.style.display = "none";
    }
};

/**
 *  When on the settings page this correctly displays the settings
 *  which the user has chosen before.
 *  @param {*} result of the storage.local.get call for the userSettings
 */
function showCorrectSettings(result){
    let showDownloadOnWebsite = document.getElementById("show-download-button-switch");
    let downloadButtonText = document.getElementById("download-button-text-setting");
    let downloadButtonColor = document.getElementById("download-button-color-setting");
    let downloadButtonHoverColor = document.getElementById("download-button-hover-color-setting");

    showDownloadOnWebsite.checked = result.userSettings.showDownloadOnWebsite;
    downloadButtonText.value = result.userSettings.buttonText;
    downloadButtonColor.value = result.userSettings.buttonColor;
    downloadButtonHoverColor.value = result.userSettings.buttonHoverColor;
};

/**
 *  Saves the user settings to the storage.local
 *  If the text fields are empty then the value is set to the default value
 *  When the settings are saved the save button is changed to green and a display message is shown.
 */
const saveUserPreferences = () => {
    let showDownloadOnWebsite = document.getElementById("show-download-button-switch");
    let downloadButtonText = document.getElementById("download-button-text-setting");
    let downloadButtonColor = document.getElementById("download-button-color-setting");
    let downloadButtonHoverColor = document.getElementById("download-button-hover-color-setting");

    if (downloadButtonText.value == ""){
        downloadButtonText.value = "Download ZIP";
    }
    if (downloadButtonColor.value == ""){
        downloadButtonColor.value = "#248bfb";
    }
    if (downloadButtonHoverColor.value == ""){
        downloadButtonHoverColor.value = "#0063ce";
    }

    let options = {
        "showDownloadOnWebsite": showDownloadOnWebsite.checked,
        "buttonText": downloadButtonText.value,
        "buttonColor": downloadButtonColor.value,
        "buttonHoverColor": downloadButtonHoverColor.value
    };
    console.log("Settings saved:}", options);
    
    chrome.storage.local.set({ "userSettings": options }, function () {
        console.log("Settings saved");
        changeSaveButtonColor();
    });
};

/** 
 *  Makes save button green when the settings are saved.
 *  Then change the button text for a moment.
 */
const changeSaveButtonColor = () => {
    let saveButton = document.getElementById("settings-save-button");
    if(saveButton.classList.contains("btn-primary")) {
        saveButton.classList.remove("btn-primary");
        saveButton.classList.add("btn-success");
        saveButton.textContent = "Saved successfully";
        setTimeout(function () { 
            saveButton.classList.remove("btn-success");
            saveButton.classList.add("btn-primary");
            saveButton.textContent = "Save";
        }, 2000);
    }
};