// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {

  console.log("New tab");
  // check if tab is already registered
  chrome.storage.local.get(
  	null,
  	function(storage) {
  		 	
  		if (storage.TabId != tabId){
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
    			
    			// ... and increase the number of time opening a facebook
    			if(storage.hasOwnProperty("OpenThisHour")){
    				//console.log("Last reset: "+storage.LastHour+" current time: "+Time.getHours());
    				
    				if( storage.LastHour == Time.getHours() ){
    					chrome.storage.local.set({ OpenThisHour: storage.OpenThisHour+1}, function(){});
    				}else{
    					chrome.storage.local.set({ OpenThisHour: 1}, function(){});
    					chrome.storage.local.set({ LastHour: Time.getHours()},function(){});
    				}
    			}else{
    				chrome.storage.local.set({ OpenThisHour: 1}, function(){});
    				chrome.storage.local.set({ LastHour: Time.getHours()},function(){});
    				//console.log("Set OpenThisHour to 1 at "+Time.getHours());
    			}
    			
    
				// ... and create an alarm to check the time in future.
				chrome.alarms.clearAll();
				//chrome.alarms.create("WatcherTimer",{ periodInMinutes: 0.1 });		// Development rate
				chrome.alarms.create("WatcherTimer",{ periodInMinutes: 5 });		// Deployment rate
				
				
				// Check usage limit and Force Stop
  				if(storage.Options.hasOwnProperty("OptionFS")){
         			if(storage.Options.OptionFS){
         			
	         			// If OptionMaxOpen is enabled
	         			if( storage.Options.OptionMaxOpen > 0){	         			
	         				if( storage.LastHour == Time.getHours() ){
	         					if( storage.OpenThisHour > storage.Options.OptionMaxOpen){
	         						chrome.tabs.update(tabId, {url:"timeout.html"});
	         						chrome.alarms.clearAll();
	         					}
	         				}				
	         			}
	         			// If OptionMaxPerHour is enabled
	         			console.log(storage.Options.OptionMaxPerHour);
	         			if( storage.Options.OptionMaxPerHour > 0){
	         				if( storage.LastHour == Time.getHours() ){
	         					console.log(storage.TimeThisHour);
	         					if( storage.TimeThisHour > storage.Options.OptionMaxPerHour){
	         						chrome.tabs.update(tabId, {url:"timeout.html"});
	         						chrome.alarms.clearAll();
	         					}	
	         				}		
	         			}
	         			
    	    		}
		         }// ... else disable Force Stop by default
  			}
  		}else{
	  		console.log("Already registered");
	  		if (tab.url.indexOf('www.facebook.com') > -1) {
	  			chrome.pageAction.show(tabId);
	  			
	  			var Time = new Date();
	  			// Check usage limit and Force Stop
  				if(storage.Options.hasOwnProperty("OptionFS")){
         			if(storage.Options.OptionFS){
	         			// If OptionMaxOpen is enabled
	         			if( storage.Options.OptionMaxOpen > 0){	         				
	         				if( storage.LastHour == Time.getHours() ){
	         					if( storage.OpenThisHour > storage.Options.OptionMaxOpen){
	         						chrome.tabs.update(storage.TabId, {url:"timeout.html"});
	         						chrome.alarms.clearAll();
	         					}
	         				}				
	         			}
	         			// If OptionMaxPerHour is enabled
	         			console.log(storage.Options.OptionMaxPerHour);
	         			if( storage.Options.OptionMaxPerHour > 0){
	         				if( storage.LastHour == Time.getHours() ){
	         					console.log(storage.TimeThisHour);
	         					if( storage.TimeThisHour > storage.Options.OptionMaxPerHour){
	         						chrome.tabs.update(tabId, {url:"timeout.html"});
	         						chrome.alarms.clearAll();
	         					}	
	         				}		
	         			}
    	    		}
		         }// ... else disable Force Stop by default
	  		}
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
	chrome.storage.local.get(
	   null,
       function(storage) {
         var alarmFired = storage.AlarmFired;
         chrome.storage.local.set({ AlarmFired: alarmFired+1}, function() {});
         
         var Time = new Date();
         var currentTime = Date.now();
         var currentSession = (currentTime-storage.SessionStartTime)/1000;
         //var usageTime = storage.SessionUsageTime + 6;  	// Development rate
         var usageTime = storage.SessionUsageTime + 300;  	// Deployment rate
		 chrome.storage.local.set({ SessionUsageTime: usageTime}, function() {});

		// record time spent on facebook
    	if(storage.hasOwnProperty("TimeThisHour")){
    		if( storage.LastHour == Time.getHours() ){
    			chrome.storage.local.set({ TimeThisHour: storage.TimeThisHour+5}, function(){});
    		}else{
    			chrome.storage.local.set({ TimeThisHour: 0}, function(){});
    			chrome.storage.local.set({ LastHour: Time.getHours()},function(){});
    		}
    	}else{
    		chrome.storage.local.set({ TimeThisHour: 5}, function(){});
    	}

         
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
	         	if( storage.Options.OptionMaxCon > 4){
	         		if( currentSession >= storage.Options.OptionMaxCon * 60){
	         			chrome.tabs.update(storage.TabId, {url:"timeout.html"});
	         			chrome.alarms.clearAll();
	         		}			
	         	}
	         	
	         	// If OptionMaxPerHour is enabled
	         	if( storage.Options.OptionMaxPerHour > 0){
	         		if( storage.TimeThisHour > storage.Options.OptionMaxPerHour){
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