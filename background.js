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
		/*this.NumberOfOpenedTaps = 0;
		this.ListOfOpenedTaps = [];
		this.ListOfRootURL = [];*/
	}
});

// ========================== Event listeners ==================================
chrome.tabs.onUpdated.addListener(getUrlFromTaps);

// ====================== Url extractor function ===============================
function getUrlFromTaps(tabId, changeInfo, tab){

	var uri = new URI(tab.url);

	rootUrl = browserModel.get("ListOfRootURL");
	rootUrl.push(uri.domain());
	rootUrl = _.uniq(rootUrl);
	browserModel.set("ListOfRootURL", rootUrl);

	console.log(browserModel.get("ListOfRootURL"));
}

var browserModel = new BrowserModel();
console.log(browserModel);
