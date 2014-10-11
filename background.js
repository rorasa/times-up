// timesup-models.js
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
		console.log(rootUrl);
	}
});

// ========================== Event listeners ==================================
chrome.tabs.onUpdated.addListener(TapChangeListener);
chrome.tabs.onRemoved.addListener(TapChangeListener);

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

// ============================= Initialisation ================================

var browserModel = new BrowserModel();
