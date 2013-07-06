// Copyright (c) 2013 White Rose Innovation. All rights reserved.
// Time's Up! background.js
// Last modified: July 2013 by Wattanit Hotrakool


//======================== checkForValidUrl ========================================
function checkForValidUrl(tabId, changeInfo, tab) {
// Called when the url of a tab changes.

// check if tab is already registered
  chrome.storage.local.get(
  	null,
  	function(storage) {

//------------------------ Newly opened tap ----------------------------------------  		 	
  		if (storage.TabId != tabId){
  			// If the url contains 'facebook' is found :
  			if (tab.url.indexOf('www.facebook.com') > -1) {
  				
  				// ... show the page action.
    			chrome.pageAction.show(tabId);
    
    	//---------------- Initialiser ---------------------------------------------
    			// ... and record the opening time to local storage
    			var Time = new Date();
    			chrome.storage.local.set({ TabId: tabId}, function() {});
    			chrome.storage.local.set({ SessionStartTime: Time.getTime()}, function() {});
    			chrome.storage.local.set({ SessionUsageTime: 0}, function() {});
    			chrome.storage.local.set({ AlarmFired: 0}, function() {});
    			
    			// ... and record the number of time opening facebook and last accessed hour
    			if(storage.hasOwnProperty("OpenThisHour")){
    				if( storage.LastHour == Time.getHours() ){ // same hour
    					chrome.storage.local.set({ OpenThisHour: storage.OpenThisHour+1}, function(){});
    				}else{ // new hour
    					chrome.storage.local.set({ OpenThisHour: 1}, function(){});
    					chrome.storage.local.set({ LastHour: Time.getHours()},function(){});
    				}
    			}else{ // Initialise
    				chrome.storage.local.set({ OpenThisHour: 1}, function(){});
    				chrome.storage.local.set({ LastHour: Time.getHours()},function(){});
    			}
    			
    			// ... and record the last accessed date
    			if(storage.hasOwnProperty("LastDay")){
    				if( storage.LastDay != Time.getDate()){ // new day
    					chrome.storage.local.set({ LastDay: Time.getDate()}, function(){});
    					chrome.storage.local.set({ TimeThisDay: 0}, function(){});
    				}    				
    			}else{ // Initialise
    				chrome.storage.local.set({ LastDay: Time.getDate()}, function(){});
    			}
    			
				// ... and create an alarm to check time in future.
				chrome.alarms.clearAll();
				chrome.alarms.create("WatcherTimer",{ periodInMinutes: 1 });
				
		//---------------- Condition check to immediately stop Facebook to load ----
				// Check if Force Stop is enabled
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
	         			if( storage.Options.OptionMaxPerHour > 0){
	         				if( storage.LastHour == Time.getHours() ){
	         					if( storage.TimeThisHour > storage.Options.OptionMaxPerHour){
	         						chrome.tabs.update(tabId, {url:"timeout.html"});
	         						chrome.alarms.clearAll();
	         					}	
	         				}		
	         			}
	         			// If OptionMaxPerDay is enabled
	         			if( storage.Options.OptionMaxPerDay > 0){
	         				if( storage.LastDay == Time.getDate() ){
	         					if( storage.TimeThisDay > storage.Options.OptionMaxPerDay*60){
	         						chrome.tabs.update(tabId, {url:"timeout.html"});
	         						chrome.alarms.clearAll();
	         					}	
	         				}
	         			}
	         			
    	    		}
		        }// ... else disable Force Stop by default
  			}
 //----------------------- Already registered tab ----------------------------------
  		}else{
  			// If the url contains 'facebook' is found :
	  		if (tab.url.indexOf('www.facebook.com') > -1) {
	  			// ... show the page action.
	  			chrome.pageAction.show(tabId);
	  			
	  	//---------------- Condition check to immediately stop Facebook to load ----
	  			var Time = new Date();
	  			// Check if Force Stop is enabled
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
	         			if( storage.Options.OptionMaxPerHour > 0){
	         				if( storage.LastHour == Time.getHours() ){
	         					if( storage.TimeThisHour > storage.Options.OptionMaxPerHour){
	         						chrome.tabs.update(tabId, {url:"timeout.html"});
	         						chrome.alarms.clearAll();
	         					}	
	         				}		
	         			}
	         			// If OptionMaxPerDay is enabled
	         			if( storage.Options.OptionMaxPerDay > 0){
	         				if( storage.LastDay == Time.getDate() ){
	         					if( storage.TimeThisDay > storage.Options.OptionMaxPerDay*60){
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

};
//========================END: checkForValidUrl ====================================

//======================== tabClose ================================================
function tabClose(tabId, removeInfo){
// Called when a tab is closed.
	chrome.storage.local.get({
		'TabId':{} },
		function(storage) {
			// Check if the closing tab is Facebook tab
			if( storage.TabId == tabId){
				chrome.alarms.clearAll();
			}
		});
};
//========================END: tabClose ============================================

//======================== watcherTimer ============================================
function watcherTimer(alarm) {
// Event timer fired every 1 minutes for conditions check and update
	chrome.storage.local.get(
	   null,
       function(storage) {
       
       //----------------- Update variables ----------------------------------------
         var alarmFired = storage.AlarmFired;
         chrome.storage.local.set({ AlarmFired: alarmFired+1}, function() {});
         
    	 // record session usage time (in seconds)
         var Time = new Date();
         var currentTime = Date.now();
         var currentSession = (currentTime-storage.SessionStartTime)/1000;
         var usageTime = storage.SessionUsageTime + 60;
		 chrome.storage.local.set({ SessionUsageTime: usageTime}, function() {});

		 // record time spent on facebook in current hour (in minutes)
    	 if(storage.hasOwnProperty("TimeThisHour")){
    		if( storage.LastHour == Time.getHours() ){ // same hour
    			chrome.storage.local.set({ TimeThisHour: storage.TimeThisHour+1}, function(){});
    		}else{ // new hour
    			chrome.storage.local.set({ TimeThisHour: 0}, function(){});
    			chrome.storage.local.set({ LastHour: Time.getHours()},function(){});
    		}
    	 }else{ // Initialise
    		chrome.storage.local.set({ TimeThisHour: 1}, function(){});
    	 }
    	 
    	 // record time spent on facebook in current day (in minutes)
    	 if(storage.hasOwnProperty("TimeThisDay")){
    		if( storage.LastDay == Time.getDate() ){ // same day
    			chrome.storage.local.set({ TimeThisDay: storage.TimeThisDay+1}, function(){});
    		}else{ // new day
    			chrome.storage.local.set({ TimeThisDay: 0}, function(){});
    			chrome.storage.local.set({ LastDay: Time.getDate()},function(){});
    		}
    	 }else{ // Initialise
    		chrome.storage.local.set({ TimeThisDay: 1}, function(){});
    	 }

	   //----------------- Display notification ------------------------------------         
         // If OptionNtf is set...
         if(!storage.Options.hasOwnProperty("OptionNtf" ) || storage.Options.OptionNtf){
	         // If notification time is set ...
	         if(storage.Options.hasOwnProperty("OptionNtfTime")){
	         	if( usageTime >= storage.Options.OptionNtfTime * 60){
	         		if (window.webkitNotifications && (window.webkitNotifications.checkPermission() == 0)) {
	         			var notification = window.webkitNotifications.createNotification(
							"icon-19.png", "Your Facebook time's up!", 
							"You have spent you time on Facebook for another "+ storage.Options.OptionNtfTime +" minutes");
						notification.show();
	         		}else{
	         			if (window.webkitNotifications){
	         				if (window.webkitNotifications.checkPermission() != 0){
  								window.webkitNotifications.requestPermission();
  							}
	         			}
	         			alert("You have spent you time on Facebook for another "+ storage.Options.OptionNtfTime +" minutes");
	         		}
	         		chrome.storage.local.set({ SessionUsageTime: 0}, function() {});
	         	}
	         }else{ // ... else default notification time is 30 minutes
 	         	if( usageTime >= 30 * 60){
	         		if (window.webkitNotifications && (window.webkitNotifications.checkPermission() == 0)) {
	         			var notification = window.webkitNotifications.createNotification(
							"icon-19.png", "Your Facebook time's up!", 
							"You have spent you time on Facebook for another "+ storage.Options.OptionNtfTime +" minutes");
						notification.show();
	         		}else{
	         			if (window.webkitNotifications){
	         				if (window.webkitNotifications.checkPermission() != 0){
  								window.webkitNotifications.requestPermission();
  							}
	         			}
	         			alert("You have spent you time on Facebook for another "+ storage.Options.OptionNtfTime +" minutes");
	         		}
	         		chrome.storage.local.set({ SessionUsageTime: 0}, function() {});
	         	}
	         }    	     	
         }
         
       //----------------- Condition check for Force Stop --------------------------
         // If OptionFS is set...
         if(storage.Options.hasOwnProperty("OptionFS")){
         	if(storage.Options.OptionFS){
	         	
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
	         	
	         	// If OptionMaxPerDay is enabled
	         	if( storage.Options.OptionMaxPerDay > 0){
	         		if( storage.TimeThisDay > storage.Options.OptionMaxPerDay*60){
	         			chrome.tabs.update(storage.TabId, {url:"timeout.html"});
	         			chrome.alarms.clearAll();
	         		}
	         	}
	         	
    	    }
         }// ... else disable Force Stop by default
         
       });
};
//========================END: watcherTimer ========================================

//======================== Event listeners =========================================
chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.tabs.onRemoved.addListener(tabClose);
chrome.alarms.onAlarm.addListener(watcherTimer);
//========================END: Event listeners =====================================