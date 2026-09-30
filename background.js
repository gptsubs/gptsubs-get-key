// Background service worker for GPTSubs — Get Key
// No data is stored or transmitted — all processing is local.

chrome.runtime.onInstalled.addListener(() => {
  console.log('GPTSubs — Get Key installed');
});
