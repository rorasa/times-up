// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {

  console.log("New tab");
  // check if tab is already registered
  chrome.storage.local.get({
  	'TabId': {} },
  	function(localId) {
  		if (localId.TabId != tabId){
  			// If the url contains 'facebook' is found :
  			if (tab.url.indexOf('www.facebook.com') > -1) {
  				// ... show the page action.
    			chrome.pageAction.show(tabId);
    
    			// ... and record the opening time to local storage
    			var Time = new Date();
    			chrome.storage.local.set({ TabId: tabId}, function() {});
    			chrome.storage.local.set({ SessionStartTime: Time.getTime()}, function() {});
    			chrome.storage.local.set({ SessionUsageTime: 0}, function() {});
    			chrome.storage.local.set({ AlarmFired: 0}, function() {});
    			//chrome.storage.local.set({ InitFlag: true}, function() {});
    			console.log("tabId = "+tabId);
    
				// ... and create an alarm to check the time in future.
				chrome.alarms.clearAll();
				//chrome.alarms.create("WatcherTimer",{ periodInMinutes: 0.1 });		// Development rate
				chrome.alarms.create("WatcherTimer",{ periodInMinutes: 5 });		// Deployment rate
  			}
  		}else{
	  		console.log("Already registered");
  		}
  	}
  );
  
  chrome.alarms.getAll(function(alarmsArr){
  	console.log("Number of alarms: "+alarmsArr.length);
  });

};

function tabClose(tabId, removeInfo){
	console.log("Tab closed: "+tabId);
	//chrome.alarms.clearAll();
	chrome.storage.local.get({
		'TabId':{} },
		function(storage) {
			//console.log("TabId = "+storage.TabId);
			if( storage.TabId == tabId){
				//console.log("clear alarms here");
				chrome.alarms.clearAll();
			}
		});
};

// main alarm for timer check
function watcherTimer(alarm) {
	console.log("alarm fired: watcherTimer");
	chrome.storage.local.get({
	   'TabId': {},
       'AlarmFired': {},
       'SessionStartTime': {},
       'SessionUsageTime': {},
       'Options': {} },
       function(storage) {
         var alarmFired = storage.AlarmFired;
         chrome.storage.local.set({ AlarmFired: alarmFired+1}, function() {});
         
         var currentTime = Date.now();
         var currentSession = (currentTime-storage.SessionStartTime)/1000;
         //var usageTime = storage.SessionUsageTime + 6;  	// Development rate
         var usageTime = storage.SessionUsageTime + 300;  	// Deployment rate
		 chrome.storage.local.set({ SessionUsageTime: usageTime}, function() {});

         //console.log(currentSession);
         
         // If OptionNtf is set...
         if(!storage.Options.hasOwnProperty("OptionNtf" ) || storage.Options.OptionNtf){
         	
	         console.log("Notiication enabled");
	         	
	         // If notification time is set ...
	         if(storage.Options.hasOwnProperty("OptionNtfTime")){
	         	if( usageTime >= storage.Options.OptionNtfTime * 60){
	         		alert("You have spent you time on Facebook for too long!");
	         		chrome.storage.local.set({ SessionUsageTime: 0}, function() {});
	         	}
	         }else{ // ... else default notification time is 30 minutes
 	         	if( usageTime >= 30 * 60){
	         		alert("You have spent you time on Facebook for too long!");
	         		chrome.storage.local.set({ SessionUsageTime: 0}, function() {});
	         	}
	         }
    	     	
         }
         
         // If OptionFS is set...
         if(storage.Options.hasOwnProperty("OptionFS")){
         	if(storage.Options.OptionFS){
	         	console.log("Force Stop enabled");
	         	
	         	// If OptionMaxCon is enabled
	         	if( storage.Options.OptionMaxCon > 0){
	         		if( currentSession >= storage.Options.OptionMaxCon * 60){
	         			chrome.tabs.update(storage.TabId, {url:"timeout.html"});
	         			chrome.alarms.clearAll();
	         		}
	         			
	         	}
	         	
    	    }
         }// ... else disable Force Stop by default
         
         
       });
       
    //chrome.storage.local.set({ InitFlag: false}, function() {});
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.tabs.onRemoved.addListener(tabClose);
chrome.alarms.onAlarm.addListener(watcherTimer);