// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  // If the url contains 'facebook' is found :
  if (tab.url.indexOf('www.facebook.com') > -1) {
    
  	chrome.storage.local.get({
       'InitFlag': {} },
       function(storage) {
       		if (storage.InitFlag != true){
	       		 // ... show the page action.
    			chrome.pageAction.show(tabId);
    
    			// ... and record the opening time to local storage
    			var Time = new Date();
    			chrome.storage.local.set({ TabId: tabId}, function() {});
    			chrome.storage.local.set({ SessionStartTime: Time.getTime()}, function() {});
    			chrome.storage.local.set({ AlarmFired: 0}, function() {});
    			chrome.storage.local.set({ InitFlag: true}, function() {});
    
				// ... and create an alarm to check the time in future.
				chrome.alarms.clearAll();
				chrome.alarms.create("WatcherTimer",{ periodInMinutes: 0.1 });
	       	}       	
       });

  }
};

function watcherTimer(alarm) {
	chrome.storage.local.get({
	   'TabId': {},
       'AlarmFired': {} },
       function(storage) {
         var alarmFired = storage.AlarmFired;
         chrome.storage.local.set({ AlarmFired: alarmFired+1}, function() {});
         
         //chrome.tabs.sendMessage(storage.TabId, { Action: "show" });
         chrome.tabs.update(storage.TabId, {url:"timeout.html"});
       });
       
    chrome.storage.local.set({ InitFlag: false}, function() {});
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.alarms.onAlarm.addListener(watcherTimer);