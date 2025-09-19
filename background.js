// Background script for JSON Formatter extension - Simple Version

// Extension installation handler
chrome.runtime.onInstalled.addListener(() => {
    console.log('JSON Formatter extension installed');
    
    // Set default settings
    chrome.storage.sync.set({
        jsonFormatterSettings: {
            indent: 2,
            sortKeys: false,
            autoDetect: true
        }
    });
});

// Simple badge indicator for JSON pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab && tab.url) {
        try {
            // Check if the page might contain JSON
            if (tab.url.includes('.json') || 
                tab.url.includes('api/') || 
                tab.url.includes('application/json')) {
                
                chrome.action.setBadgeText({
                    tabId: tabId,
                    text: 'JSON'
                });
                
                chrome.action.setBadgeBackgroundColor({
                    tabId: tabId,
                    color: '#4CAF50'
                });
            } else {
                chrome.action.setBadgeText({
                    tabId: tabId,
                    text: ''
                });
            }
        } catch (error) {
            console.log('Badge update failed:', error);
        }
    }
});
