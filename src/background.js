const START_INDEX = 0;

function waitForAuthOrDownload(theTabId, i) {
  var onTabs;
  chrome.tabs.onUpdated.addListener(
    (onTabs = function(tabId, changeInfo, tab) {
      if (tabId === theTabId && changeInfo.status === "complete") {
        console.log("tab loaded", tabId, changeInfo, tab);
        chrome.tabs.onUpdated.removeListener(onTabs);
        chrome.tabs.executeScript(
          tabId,
          { file: "src/content_script.js" },
          () => {
            // Wait a bit for good measure.
            chrome.tabs.executeScript(
              tabId,
              { code: "setTimeout(login, 1000)" },
              () => {}
            );
          }
        );
      }
    })
  );
  chrome.downloads.onCreated.addListener(function onDownloading(theDownload) {
    chrome.downloads.onCreated.removeListener(onDownloading);
    chrome.tabs.onUpdated.removeListener(onTabs);
    chrome.downloads.onChanged.addListener(function onDownloaded(download) {
      if (theDownload.id === download.id && download.state) {
        console.log(download);
        switch (download.state.current) {
          case "complete":
            console.log(`completed ${i}!`);
            autoDownload(i + 1);
            break;
          case "interrupted":
            console.log(`retrying ${i}`);
            autoDownload(i);
            break;
          default:
            break;
        }
      }
    });
  });
}

function autoDownload(i, retry = 0) {
  if (retry > 5) return;
  chrome.tabs.create(
    { url: "https://takeout.google.com/settings/takeout/downloads" },
    theTab => {
      chrome.tabs.onUpdated.addListener(function onTabs(
        tabId,
        changeInfo,
        tab
      ) {
        if (
          tabId === theTab.id &&
          changeInfo.status === "complete" &&
          tab.url === "https://takeout.google.com/settings/takeout/downloads"
        ) {
          chrome.tabs.onUpdated.removeListener(onTabs);
          chrome.tabs.executeScript(
            tab.id,
            { file: "src/content_script.js" },
            function() {
              console.log(
                "autoDownload executeScript(content_script)",
                arguments
              );
              // Sometimes I get an error, "cannot access contents of the page".
              // No idea why.
              if (chrome.runtime.lastError) {
                return setTimeout(() => autoDownload(i, retry + 1), 10000);
              }
              chrome.tabs.executeScript(
                tab.id,
                { code: `getDownload(${i})` },
                function() {
                  console.log(
                    "autoDownload executeScript(getDownload)",
                    arguments
                  );
                  if (chrome.runtime.lastError) {
                    return setTimeout(() => autoDownload(i, retry + 1), 10000);
                  }
                  waitForAuthOrDownload(tab.id, i);
                }
              );
            }
          );
        }
      });
    }
  );
}

chrome.browserAction.onClicked.addListener(function(tab) {
  autoDownload(START_INDEX);
});
