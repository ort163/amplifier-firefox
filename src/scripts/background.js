// By John Pettitt
// Creative Commons CC(0)  Public domain

var ampTabs = {};

chrome.runtime.onMessage.addListener(function(amp, sender, sendResponse) {
    if (amp.sentinel === undefined || amp.sentinel !== "__AMPLIFIER__") {
        return;  // not from amplifier
    }

    if (amp.isamp) {
        chrome.pageAction.setIcon({tabId: sender.tab.id, path: 'media/canonical.png'});
        chrome.pageAction.setTitle({tabId: sender.tab.id, title: 'Show the Canonical version of this page'});
    } else {
        if (amp.ampurl !== null) {
            chrome.pageAction.setIcon({tabId: sender.tab.id, path: 'media/amplify.png'});
            chrome.pageAction.setTitle({tabId: sender.tab.id, title: 'Show the AMP version of this page'});
        } else {
            chrome.pageAction.setTitle({tabId: sender.tab.id, title: 'AMP version not detected'});
        }
    }

    if (amp.ampurl !== null || (amp.isamp && amp.canonical !== null)) {
        chrome.pageAction.show(sender.tab.id);
    }

    ampTabs[sender.tab.id] = amp;
});

chrome.tabs.onRemoved.addListener(function(tabId) {
	delete ampTabs[tabId];
});

chrome.pageAction.onClicked.addListener(function(tab) {
	var amp = ampTabs[tab.id];
	if (amp.isamp) {
		if (amp.canonical !== null) {
			chrome.tabs.update(tab.id, { url: amp.canonical });
		}
	} else {
		chrome.tabs.update(tab.id, { url: amp.ampurl });
	}
});
