// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  // If the url contains 'facebook' is found :
  if (tab.url.indexOf('www.facebook.com') > -1) {
  
  	/*// ... show the page action.
    			chrome.pageAction.show(tabId);
    
    			// ... and record the opening time to local storage
    			var Time = new Date();
    			chrome.storage.local.set({ TabId: tabId}, function() {});
    			chrome.storage.local.set({ SessionStartTime: Time.getTime()}, function() {});
    			chrome.storage.local.set({ AlarmFired: 0}, function() {});
    			chrome.storage.local.set({ InitFlag: true}, function() {});
    
    			// ... and inject a mask into the Facebook page
    			chrome.tabs.executeScript(null, {file: "jquery-1.10.1.min.js"});
			    chrome.tabs.executeScript(null, {file: "jquery-ui-1.10.3.custom.min.js"});
			    chrome.tabs.insertCSS(null, {file: "jquery-ui-1.10.3.custom.min.css"});
				chrome.tabs.executeScript(null, {file: "inject.js"});
	
				// ... and create an alarm to check the time in future.
				chrome.alarms.clearAll();
				chrome.alarms.create("WatcherTimer",{ periodInMinutes: 0.1 });*/
  
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
    
    			// ... and inject a mask into the Facebook page
    			//chrome.tabs.executeScript(null, {file: "jquery-1.10.1.min.js"});
			    //chrome.tabs.executeScript(null, {file: "jquery-ui-1.10.3.custom.min.js"});
			    //chrome.tabs.insertCSS(null, {file: "jquery-ui-1.10.3.custom.min.css"});
				//chrome.tabs.executeScript(null, {file: "inject.js"});
	
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

/*function checkForFacebook(details){
// If the url contains 'facebook' is found :
  if (details.url.indexOf('facebook') > -1) {
  
  	 // ... show the page action.
    chrome.pageAction.show(details.tabId);
    
    // ... and record the opening time to local storage
    var Time = new Date();
    chrome.storage.local.set({ TabId: details.tabId}, function() {});
    chrome.storage.local.set({ SessionStartTime: Time.getTime()}, function() {});
    chrome.storage.local.set({ AlarmFired: 0}, function() {});
    chrome.storage.local.set({ InitFlag: true}, function() {});
    
    // ... and inject a mask into the Facebook page
    chrome.tabs.executeScript(null, {file: "jquery-1.10.1.min.js"});
    chrome.tabs.executeScript(null, {file: "jquery-ui-1.10.3.custom.min.js"});
    chrome.tabs.insertCSS(null, {file: "jquery-ui-1.10.3.custom.min.css"});
	chrome.tabs.executeScript(null, {file: "inject.js"});
	
	// ... and create an alarm to check the time in future.
	chrome.alarms.clearAll();
	chrome.alarms.create("WatcherTimer",{ periodInMinutes: 0.1 });
  
  	chrome.storage.local.get({
       'InitFlag': {} },
       function(storage) {
       		if (storage.InitFlag != true){
	       		 // ... show the page action.
    			chrome.pageAction.show(details.tabId);
    
    			// ... and record the opening time to local storage
    			var Time = new Date();
    			chrome.storage.local.set({ TabId: details.tabId}, function() {});
    			chrome.storage.local.set({ SessionStartTime: Time.getTime()}, function() {});
    			chrome.storage.local.set({ AlarmFired: 0}, function() {});
    			chrome.storage.local.set({ InitFlag: true}, function() {});
    
    			// ... and inject a mask into the Facebook page
    			chrome.tabs.executeScript(null, {file: "jquery-1.10.1.min.js"});
			    chrome.tabs.executeScript(null, {file: "jquery-ui-1.10.3.custom.min.js"});
				chrome.tabs.executeScript(null, {file: "inject.js"});
	
				// ... and create an alarm to check the time in future.
				chrome.alarms.clearAll();
				chrome.alarms.create("WatcherTimer",{ periodInMinutes: 0.1 });
	       	}       	
       });

  }
};*/

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
//chrome.webNavigation.onCompleted.addListener(checkForFacebook);

chrome.alarms.onAlarm.addListener(watcherTimer);