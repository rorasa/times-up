// Copyright (c) 2013 White Rose Innovation. All rights reserved.
// Time's Up! background.js
// Last modified: July 2013 by Wattanit Hotrakool


//======================== checkForValidUrl ========================================
function checkForValidUrl(tabId, changeInfo, tab) {
// Called when the url of a tab changes.

// load local storage data
chrome.storage.local.get(
	null,
	function(storage) {
	
	// check for the integrity of TabId
	if(storage.hasOwnProperty("TabId")){
		if(typeof storage.TabId === "undefined"){ // If TabId's type is undefined, reset
			var TabIdVector = new Array();
			chrome.storage.local.set({ TabId: TabIdVector}, function() {});
		}	
	}else{ // If there is no TabId, create one
		var TabIdVector = new Array();
		chrome.storage.local.set({ TabId: TabIdVector}, function() {});
	}
	
//------------------- check for a new facebook tab ---------------------------------
	if (storage.TabId.indexOf(tabId)<0){
//------------------------ Newly opened tap ----------------------------------------  
		// If the url contains 'facebook' is found :
  		if (tab.url.indexOf('www.facebook.com') > -1) {
  			// shows the page action button
  			chrome.pageAction.show(tabId);
  			
  			// If this is not the only facebook tab present
  			if(storage.TabId.length > 0){ // add tabId into TabId
  				var TabIdVector = storage.TabId;
    			TabIdVector.push(tabId);
    			chrome.storage.local.set({ TabId: TabIdVector}, function() {});
  			}else{ // else it is the only tab, start Time's Up!
  			//---------------- Initialiser -----------------------------------------
  				var TabIdVector = storage.TabId;
  				TabIdVector.push(tabId); 			// add new tab into TabId
  				
  				var Time = new Date();				// create time object
  				
  				// record TabId, initialise AlarmFired, record SessionStartTime, reset SessionUsageTime
  				chrome.storage.local.set({ TabId: TabIdVector}, function() {});
  				chrome.storage.local.set({ AlarmFired: 0}, function() {});
				chrome.storage.local.set({ SessionStartTime: Time.getTime()}, function() {});
				chrome.storage.local.set({ SessionUsageTime: 0}, function() {});
				
				// update LastDay
  				if(storage.hasOwnProperty("LastDay")){
  					if( storage.LastDay != Time.getDate()){ // new day
  						// reset
  						chrome.storage.local.set({ LastDay: Time.getDate()}, function(){});
						chrome.storage.local.set({ TimeThisDay: 0}, function(){});
  					}  				
  				}else{ // Initialise
  					chrome.storage.local.set({ LastDay: Time.getDate()}, function(){});
  				}
  				
  				// update LastHour
  				if(storage.hasOwnProperty("LastHour")){
  					if( storage.LastHour != Time.getHours()){ // new hour
  						chrome.storage.local.set({ LastHour: Time.getHours()},function(){});
  						chrome.storage.local.set({ OpenThisHour: 1}, function(){});  		
  						chrome.storage.local.set({ TimeThisHour: 0}, function(){});				
  					}
  				}else{ // Initialise
  					chrome.storage.local.set({ LastHour: Time.getHours()},function(){});
  				}
				
				// record number of facebook opened in this hour
				if(storage.hasOwnProperty("OpenThisHour")){
					if( storage.LastHour == Time.getHours() ){ // same hour
						// count up
						chrome.storage.local.set({ OpenThisHour: storage.OpenThisHour+1}, function(){});
					}else{ // new hour
						// reset counter
						chrome.storage.local.set({ OpenThisHour: 1}, function(){});
					}
				}else{ // Initialise
					chrome.storage.local.set({ OpenThisHour: 1}, function(){});
				}
						
  			//---------------- Create alarm timer ----------------------------------		
				chrome.alarms.clearAll();
				chrome.alarms.create("WatcherTimer",{ periodInMinutes: 1 });
				
  			}
  		}	
//------------------------ Already opened tab --------------------------------------
	}else{
		// If the url contains 'facebook' is found :
		if (tab.url.indexOf('www.facebook.com') > -1) {
			// ... show the page action.
			chrome.pageAction.show(tabId);			
		}else{ // if the tab is no longer facebook
			tabClose(tabId,{});
		}
	}	
});

//------------------ Conditions check for Force Stop! ------------------------------
chrome.storage.local.get(
	null,
	function(storage) {
		// if the tab is a facebook
		if (tab.url.indexOf('www.facebook.com') > -1) {
			// Check if Force Stop is enabled
  			if(storage.Options.hasOwnProperty("OptionFS")){
  				if(storage.Options.OptionFS){
  					var Time = new Date();
  					
  					// If OptionMaxOpen is enabled
  					if( storage.Options.OptionMaxOpen > 0){	   
  						if( storage.LastHour == Time.getHours() ){ // if it's the same hour
  							if( storage.OpenThisHour > storage.Options.OptionMaxOpen){ // and OpenThisHour exceeds limit
  								chrome.tabs.update(tabId, {url:"timeout.html"});
	         					chrome.alarms.clearAll();
  					}}}
  					
  					// If OptionMaxPerHour is enabled
  					if( storage.Options.OptionMaxPerHour > 0){
  						if( storage.LastHour == Time.getHours() ){ // if it's the same hour
  							if( storage.TimeThisHour > storage.Options.OptionMaxPerHour){ // and TimeThisHour exceeds limit
  								chrome.tabs.update(tabId, {url:"timeout.html"});
	         					chrome.alarms.clearAll();
  					}}}
  					
  					// If OptionMaxPerDay is enabled
  					if( storage.Options.OptionMaxPerDay > 0){
  						if( storage.LastDay == Time.getDate() ){ // if it's the same hour
  							if( storage.TimeThisDay > storage.Options.OptionMaxPerDay*60){ // and TimeThisDay exceeds limit
  								chrome.tabs.update(tabId, {url:"timeout.html"});
	         					chrome.alarms.clearAll();
  					}}}  			
  							
  				}
  			} // ... else disable Force Stop by default
		}		
});

/*chrome.storage.local.get({
	'TabId':{} },
	function(storage) {
		console.log(typeof storage.TabId);
		console.log(storage.TabId.length);
	});*/
};


//========================END: checkForValidUrl ====================================

//======================== tabClose ================================================
function tabClose(tabId, removeInfo){
// Called when a tab is closed.
	chrome.storage.local.get({
		'TabId':{} },
		function(storage) {
			// Check if the closing tab is Facebook tab
			if( storage.TabId.indexOf(tabId)>=0){
				var TabIdVector = storage.TabId;
    			TabIdVector.splice(storage.TabId.indexOf(tabId),1);
    			chrome.storage.local.set({ TabId: TabIdVector}, function() {});
    			// If this is the last facebook tab, clear all alarms
    			if ( TabIdVector.length < 1 ){
    				console.log("clear alarms");
    				chrome.alarms.clearAll();
    			}
			}
		});
};
//========================END: tabClose ============================================

//======================== watcherTimer ============================================
// Event timer fired every 1 minutes for conditions check and update
function watcherTimer(alarm) {
	chrome.alarms.getAll(function(almList){
		console.log("# of alarms: "+almList.length);
	});
	chrome.storage.local.get(
	   null,
       function(storage) {
       console.log("step 1 "+typeof storage.TabId);
       //----------------- Update variables ----------------------------------------
       		// Update alarmFired
       		var alarmFired = storage.AlarmFired;
         	chrome.storage.local.set({ AlarmFired: alarmFired+1}, function() {});
         	
         	// record SessionUsageTime
         	var Time = new Date();
         	var usageTime = storage.SessionUsageTime + 60;
         	chrome.storage.local.set({ SessionUsageTime: usageTime}, function() {});
         	
         	// record time spent on facebook in this hour (in minutes)
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
         	
         	// record time spent on facebook in this day (in minutes)
         	if(storage.hasOwnProperty("TimeThisDay")){
         		if( storage.LastDay == Time.getDate() ){ // same day
         			chrome.storage.local.set({ TimeThisDay: storage.TimeThisDay+1}, function(){});
         		}else{
         			chrome.storage.local.set({ TimeThisDay: 0}, function(){});
    				chrome.storage.local.set({ LastDay: Time.getDate()},function(){});
         		}
         	}else{ // Initialise
         		chrome.storage.local.set({ TimeThisDay: 1}, function(){});
         	}
         	
    	//----------------- Display notification -----------------------------------
         	// If OptionNtf is set...
         	if(!storage.Options.hasOwnProperty("OptionNtf" ) || storage.Options.OptionNtf){
         		// If notification time is set ...
         		if(storage.Options.hasOwnProperty("OptionNtfTime")){
         			if( usageTime >= storage.Options.OptionNtfTime * 60){ // If usageTime reaches OptionNtfTime
         				if (window.webkitNotifications && (window.webkitNotifications.checkPermission() == 0)) {
         					var notification = window.webkitNotifications.createNotification(
							"icon-32.png", "Your Facebook time's up!", 
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
         			}
         		}else{ // ... else default notification time is 30 minutes
         			if( usageTime >= 30 * 60){
         				if (window.webkitNotifications && (window.webkitNotifications.checkPermission() == 0)) {
	         				var notification = window.webkitNotifications.createNotification(
								"icon-32.png", "Your Facebook time's up!", 
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
    });
    
    chrome.storage.local.get(
	   null,
       function(storage) {
       	console.log("step 2 "+typeof storage.TabId);
//------------------ Conditions check for Force Stop! ------------------------------
			// Check if Force Stop is enabled
			if(storage.Options.hasOwnProperty("OptionFS")){
				if(storage.Options.OptionFS){
					
					// compute currentSession
         			var Time = new Date();
         			var currentTime = Date.now();
         			var currentSession = (currentTime-storage.SessionStartTime)/1000;
         			
					// If OptionMaxCon is enabled
	         		if( storage.Options.OptionMaxCon > 4){
	         			if( currentSession >= storage.Options.OptionMaxCon * 60){
	         				console.log("# of tab: "+storage.TabId.length);
	         				console.log(storage.TabId);
	         				var numTab = storage.TabId.length;
	         				for(var i=0;i<numTab;i++){
	         					var currTab = storage.TabId.pop();
	         					chrome.tabs.update(currTab, {url:"timeout.html"});
	         					console.log("Update tab"+currTab);
	         				}
	         				chrome.alarms.clearAll();
	         		}}
	         		
	         		// If OptionMaxPerHour is enabled
  					if( storage.Options.OptionMaxPerHour > 0){
  						if( storage.LastHour == Time.getHours() ){ // if it's the same hour
  							if( storage.TimeThisHour >= storage.Options.OptionMaxPerHour){ // and TimeThisHour exceeds limit
  								console.log("# of tab: "+storage.TabId.length);
	         					console.log(storage.TabId);
  								var numTab = storage.TabId.length;
  								for(var i=0;i<numTab;i++){
  									var currTab = storage.TabId.pop();
  									chrome.tabs.update(currTab, {url:"timeout.html"});
	         						console.log("Update tab"+currTab);
  								}
	         					chrome.alarms.clearAll();
  					}}}
  					
  					// If OptionMaxPerDay is enabled
  					if( storage.Options.OptionMaxPerDay > 0){
  						if( storage.LastDay == Time.getDate() ){ // if it's the same hour
  							if( storage.TimeThisDay >= storage.Options.OptionMaxPerDay*60){ // and TimeThisDay exceeds limit
  								console.log("# of tab: "+storage.TabId.length);
	         					console.log(storage.TabId);
	         					var numTab = storage.TabId.length;
  								for(var i=0;i<numTab;i++){
  									var currTab = storage.TabId.pop();
  									chrome.tabs.update(currTab, {url:"timeout.html"});
	         						console.log("Update tab"+currTab);
  								}
	         					chrome.alarms.clearAll();
  					}}} 
	         		
				}
			}// ... else disable Force Stop by default
			console.log("step 3 "+typeof storage.TabId);
    });
};
//========================END: watcherTimer ========================================

//======================== Event listeners =========================================
chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.tabs.onRemoved.addListener(tabClose);
chrome.alarms.onAlarm.addListener(watcherTimer);
//========================END: Event listeners =====================================

//======================== First setup after install ===============================
chrome.runtime.onInstalled.addListener(function(details){
	if(details.reason == "install"){ // Freshly install
		chrome.tabs.create({url: "setup.html"});
	}else if(details.reason == "update"){ // Updated a new version
		//chrome.tabs.create({url: "setup.html"});
	}
	
});
//========================END: First setup after install ===========================
