//$(document).ready(function(){
//	$("body").prepend("<div id=\"WatcherMask\" style=\"width:100%;height:1000px;position:fixed;top:0px;right:0px;z-index:500;\"></div>");
//	$("#WatcherMask").append("<div id=\"WatcherMaskBG\" style=\"background-color:#aaaaaa;width:100%;height:100%;position:absolute;top:0px;right:0px;opacity:0.7;z-index:501;\"></div>");
//	$("#WatcherMask").append("<div id=\"WatcherClose\" style=\"background-color:#444444;color:#ffffff;width:100px;height:30px;padding-top:10px;position:absolute;top:0px;right:50px;text-align:center;z-index:502;\">Close</div>");
//	
//	
//	
//	$("#WatcherClose").click(function(){
//		$("#WatcherMask").toggle(1000);
//		$("#WatcherMaskBG").toggle();
//	});
//});

$(document).ready(function(){

	var highest_index = 0;

	$("[z-index]").each(function() {
    	if ($(this).attr("z-index") > highest_index) {
         highest_index = $(this).attr("z-index");
    	}
	});
	
	//$("body").prepend("<div id=\"WatcherMask\"></div>");	
	$("body").prepend("<div id=\"WatcherDialog\"> \
	 <h1 style=\"font-size: 2em;\">You have spent you time on Facebook for too long!</h1> \
	 <p style=\"font-size: 1em;\"> Why not take a break and do something good? </p> \
	 </div>");
	//$("#WatcherMask").attr("z-index", 50001); 
	$("#WatcherDialog").attr("z-index", 50002);
	/*$("#WatcherMask").css("background-color","#111111");
	$("#WatcherMask").css("opacity","0.7");
	$("#WatcherMask").css("width","100%");
	$("#WatcherMask").css("height","600px");
	$("#WatcherMask").css("position","absolute");
	$("#WatcherMask").css("top","0px");
	$("#WatcherMask").css("left","0px");*/

	$("#WatcherDialog").css("background-color","#cccccc");
	$("#WatcherDialog").css("border-style","groove");
	$("#WatcherDialog").css("border-width","3px");
	$("#WatcherDialog").css("border-color","#888888");
	$("#WatcherDialog").css("padding","10px");
	$("#WatcherDialog").css("text-align","center");
	$("#WatcherDialog").dialog({ autoOpen: false, width: 600, height: 350, draggable: false, modal: true });
	$("#WatcherDialog").dialog("open");
	//$("#test").dialog({ autoOpen: false });
	//$("#test").dialog("open")
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		//$("#WatcherDialog").text("HELLO WORLD");
		//$("#WatcherDialog").dialog("close");
		//$("#WatcherDialog").dialog("open");
		//$("#WatcherDialog").show();
		//if( request.Action == "show" ){         //<< has some problem with this condition check
		//	$("#WatcherDialog").dialog("close");
		//}
	});