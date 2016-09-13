function waitForAuthOrDownload(theTabId, i) {
  var onTabs;
  chrome.tabs.onUpdated.addListener(onTabs = function(tabId, changeInfo, tab) {
    if (tabId === theTabId && changeInfo.status === 'complete') {
      console.log('tab loaded', tabId, changeInfo, tab)
      chrome.tabs.onUpdated.removeListener(onTabs);
      chrome.tabs.executeScript(tabId, {file: "src/content_script.js"}, () => {
        // Wait a bit for good measure.
        chrome.tabs.executeScript(tabId, {code: 'setTimeout(login, 1000)'}, () => {});
      });
    }
  });
  chrome.downloads.onCreated.addListener(function onDownloading(theDownload) {
    chrome.downloads.onCreated.removeListener(onDownloading);
    chrome.tabs.onUpdated.removeListener(onTabs);
    chrome.downloads.onChanged.addListener(function onDownloaded(download) {
      if (theDownload.id === download.id && download.state) {
        console.log(download);
        switch (download.state.current) {
          case 'complete':
            console.log(`completed ${i}!`);
            autoDownload(i + 1);
            break;
          case 'interrupted':
            console.log(`retrying ${i}`)
            autoDownload(i);
            break;
          default:
            break;
        }
      }
    });
  });
}

function autoDownload(i) {
  chrome.tabs.create({url: 'https://takeout.google.com/settings/takeout/downloads'}, (theTab) => {
    chrome.tabs.onUpdated.addListener(function onTabs(tabId, changeInfo, tab) {
      if (tabId === theTab.id && changeInfo.status === 'complete' && tab.url === 'https://takeout.google.com/settings/takeout/downloads') {
        chrome.tabs.onUpdated.removeListener(onTabs);
        chrome.tabs.executeScript(tab.id, {file: "src/content_script.js"}, () => {
          chrome.tabs.executeScript(tab.id, {code: `getDownload(${i})`}, () => {
            waitForAuthOrDownload(tab.id, i);
          });
        });
      }
    });
  });
}

chrome.browserAction.onClicked.addListener(function(tab) {
  autoDownload(0);
});
