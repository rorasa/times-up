// background.js
// Defines central models of Time's Up

// =========================== Browser model ===================================
var BrowserModel = Backbone.Model.extend({
	defaults: {
		"NumberOfOpenedTaps": 0,
		"ListOfOpenedTaps"  : [],
		"ListOfRootURL"     : []
	},

	initialize: function(){
		this.on("change:ListOfOpenedTaps",this.updateModel)
	},
	updateTaps: function(urlList, numberOfTaps){
		this.set({"ListOfOpenedTaps": urlList});
		this.set({"NumberOfOpenedTaps": numberOfTaps});
	},
	updateModel: function(){
		var urlList = this.get("ListOfOpenedTaps");
		var noOfUrls = urlList.length;
		var rootUrl = [];
		for (var i=0; i<noOfUrls; i++){
			var uri = new URI(urlList[i]);
			rootUrl.push(uri.domain());
		}
		rootUrl = _.uniq(rootUrl);
		browserModel.set({"ListOfRootURL": rootUrl});
		//console.log(rootUrl);
	}
});

// =========================== Website Model ===================================
var WebsiteModel = Backbone.Model.extend({
	defaults: {
		"Domain"    : "",
		"TimeRecord": {
				TotalTime: 0,
		  },
		"Setting"   : [],
		"Stats"     : []
	},

	initialize: function(){

	},
	addTime: function(time){
		var newTime = this.get("TimeRecord").TotalTime += time;
		console.log(newTime);
		this.set("TimeRecord",{TotalTime: newTime});
		console.log(this.get("TimeRecord").TotalTime);
	}
});

var WebsiteList = Backbone.Collection.extend({
	model: WebsiteModel
});

// ========================== Global Setting ===================================
var GlobalSetting = Backbone.Model.extend({
		defaults:{
			UpdateInterval: 15
		}
});

// ====================== Url extractor function ===============================
function TapChangeListener(tabId, changeInfo, tab){
	// event handler function to update urls in browser model
	// get all urls from every opened taps
	chrome.windows.getAll({"populate" : true},updateUrlList);
}

function updateUrlList(windows){
	urlList = [];
	numberOfTaps = 0;
	var numWindows = windows.length;
	for (var i=0; i<numWindows; i++){
		var win = windows[i];
		var numTabs = win.tabs.length;
		numberOfTaps += numTabs;
		for (var j=0; j<numTabs; j++){
			var tab = win.tabs[j];
			urlList.push(tab.url);
		}
	}
	browserModel.updateTaps(urlList, numberOfTaps);
}

// ======================= Tracking processing function ========================
function trackWebsite(){
	console.log("15 seconds passed.");
	var openDomainList = browserModel.get("ListOfRootURL");
	for(var i=0;i<siteList.models.length;i++){
		var site = siteList.at(i);
		if(openDomainList.indexOf(site.get("Domain"))>-1){
			console.log(site.get("Domain")+" is open.");
			site.addTime(globalSetting.get("UpdateInterval"));
		}
	}
}

// ============================= Initialisation ================================

var globalSetting = new GlobalSetting();
var browserModel = new BrowserModel();
var siteModel_1 = new WebsiteModel({Domain: "facebook.com"});
var siteModel_2 = new WebsiteModel({Domain: "twitter.com"});
var siteList = new WebsiteList([siteModel_1,siteModel_2]);


// ========================== Event listeners ==================================
chrome.tabs.onUpdated.addListener(TapChangeListener);
chrome.tabs.onRemoved.addListener(TapChangeListener);
setInterval(trackWebsite,1000*globalSetting.get("UpdateInterval"));
