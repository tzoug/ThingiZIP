/**
 *  Listen for messages
 *  If received message to create default settings then create default settings
 *  Create the default settings, and then send response back to sender that the settings are created
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request == "Please create default settings") {
    createDefaultSettings();
    if (sender.tab.url.includes("https://www.thingiverse.com/thing:")) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, "Default settings created and saved");  
      });
    }
    else{
      sendResponse("Default settings created and saved");
    }
  }
});

/*
  Create the default settings and store them in storage.local
*/
const createDefaultSettings = () => {
  let defaultSettings = {
    showDownloadOnWebsite: true,
    buttonText: "Download ZIP",
    buttonColor: "#248bfb",
    buttonHoverColor: "#0063ce"
  };
  chrome.storage.local.set({ userSettings: defaultSettings }, function () {
    console.log("Default settings created and saved");
    chrome.runtime.sendMessage("Default settings created and saved");
  });
};
