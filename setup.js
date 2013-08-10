// Copyright (c) 2013 White Rose Innovation. All rights reserved.
// Time's Up! setup.js
// Last modified: July 2013 by Wattanit Hotrakool

//======================== Main function ===========================================
$(document).ready(function(){

	//-------------------- Initialiser ---------------------------------------------
	$("#notification").hide();
	$("#notificationOptions").hide();
	$("#forcestop").hide();
	$("#forceStopOptions").hide();
	$("#done").hide();
	$("#MaxCon").val(4);
	$("#MaxConDisplay").text("Disabled");
	$("#MaxPerDay").val(0);
	$("#MaxPerDayDisplay").text("Disabled");
	$("#MaxPerHour").val(0);
	$("#MaxPerHourDisplay").text("Disabled");
	$("#MaxOpen").val(0);
	$("#MaxOpenDisplay").text("Disabled");
	
	//-------------------- Event listeners -----------------------------------------
	$("#introButton").click(function(){
		$("#notification").show("slow");
		$("#introButton").hide();
	});
	
	$("#EnableNotification").change(function(){
  		save_options();
  		if( $("#EnableNotification").prop('checked') ){
  			$("#notificationOptions").show("slow");
  			$("#forcestop").show("slow");
  			if (window.webkitNotifications) {
  				if (window.webkitNotifications.checkPermission() != 0){
  					window.webkitNotifications.requestPermission();
  				}
  			}
  		}
  	});
  	
  	$("#DisableNotification").change(function(){
  		save_options();
  		if( $("#DisableNotification").prop('checked') ){
  			$("#notificationOptions").hide("slow");
  			$("#forcestop").show("slow");
  		}
  	});
  	
  	$("#NtfTime").change(save_options);
  	
  	$("#EnableForceStop").change(function(){
  		save_options();
		if( $('#EnableForceStop').prop('checked') ){
    		$("#forceStopOptions").show("slow");
    		$("#done").show("show");
		}
  	});
  	
  	$("#DisableForceStop").change(function(){
  		save_options();
		if( $('#DisableForceStop').prop('checked') ){
    		$("#forceStopOptions").hide("slow");
    		$("#done").show("show");
		}
  	});
  	
  	$("#MaxCon").change(function(){
  		save_options();
  		if($("#MaxCon").val()>4){
  			$("#MaxConDisplay").text($("#MaxCon").val()+" minutes");
  		}else{
  			$("#MaxConDisplay").text("Disabled");
  		}
  	});
  	$("#MaxConAsk").mouseenter(function(){
  		$("#MaxConHelp").show();
  	});
  	$("#MaxConAsk").mouseleave(function(){
  		$("#MaxConHelp").hide();
  	});
  	$("#MaxPerDay").change(function(){
  		save_options();
  		if($("#MaxPerDay").val()>0){
  			$("#MaxPerDayDisplay").text($("#MaxPerDay").val()+" hours");
  		}else{
  			$("#MaxPerDayDisplay").text("Disabled");
  		}
  	});
  	$("#MaxPerDayAsk").mouseenter(function(){
  		$("#MaxPerDayHelp").show();
  	});
  	$("#MaxPerDayAsk").mouseleave(function(){
  		$("#MaxPerDayHelp").hide();
  	});
  	$("#MaxPerHour").change(function(){
  		save_options();
  		if($("#MaxPerHour").val()>0){
  			$("#MaxPerHourDisplay").text($("#MaxPerHour").val()+" minutes");
  		}else{
  			$("#MaxPerHourDisplay").text("Disabled");
  		}
  	});
	$("#MaxPerHourAsk").mouseenter(function(){
  		$("#MaxPerHourHelp").show();
  	});
  	$("#MaxPerHourAsk").mouseleave(function(){
  		$("#MaxPerHourHelp").hide();
  	});
  	$("#MaxOpen").change(function(){
  		save_options();
  		if($("#MaxOpen").val()>0){
  			$("#MaxOpenDisplay").text($("#MaxOpen").val()+" times");
  		}else{
  			$("#MaxOpenDisplay").text("Disabled");
  		}
  	});
  	$("#MaxOpenAsk").mouseenter(function(){
  		$("#MaxOpenHelp").show();
  	});
  	$("#MaxOpenAsk").mouseleave(function(){
  		$("#MaxOpenHelp").hide();
  	});

});
//========================END: Main function =======================================

//======================== save_options ============================================
function save_options() {
// save option to local storage

	// enable notification (boolean)
	var optionNtf = $('#EnableNotification').prop('checked');
	
	// notification time (integer)
	var optionNtfTime;
	if( $('#Ntf5mins').prop('selected') ){
		optionNtfTime = 5; 
	}else if ( $('#Ntf10mins').prop('selected') ){
		optionNtfTime = 10;
	}else if ( $('#Ntf20mins').prop('selected') ){
		optionNtfTime = 20;
	}else if ( $('#Ntf30mins').prop('selected') ){
		optionNtfTime = 30;
	}else if ( $('#Ntf45mins').prop('selected') ){
		optionNtfTime = 45;
	}else if ( $('#Ntf1hours').prop('selected') ){
		optionNtfTime = 60;
	}else if ( $('#Ntf2hours').prop('selected') ){
		optionNtfTime = 120;
	}else if ( $('#Ntf3hours').prop('selected') ){
		optionNtfTime = 180;
	}
	
	// enable Force Stop (boolean)
	var optionFS = $("#EnableForceStop").prop('checked');
	
	// Max continuous time allow (integer)
	var optionMaxCon = $("#MaxCon").val();
	
	// Max hour per day allow (integer)
	var optionMaxPerDay = $("#MaxPerDay").val();
	
	// Max minute per hour allow (integer)
	var optionMaxPerHour = $("#MaxPerHour").val();
	
	// Max open per hour allow (integer)
	var optionMaxOpen = $("#MaxOpen").val();
	
	// enable Force Stop warning (boolean)
	var optionFSWarning = $("#EnableForceStopWarning").prop('checked');
		
	// create options object and save to local storage
	var options = {
		OptionNtf: optionNtf, 
		OptionNtfTime: optionNtfTime,
		OptionFS: optionFS,
		OptionMaxCon: optionMaxCon,
		OptionMaxPerDay: optionMaxPerDay,
		OptionMaxPerHour: optionMaxPerHour,
		OptionMaxOpen: optionMaxOpen,
		OptionFSWarning: optionFSWarning
	};
	chrome.storage.local.set({ Options: options}, function() {});//$('#console').text("options saved");	
	
	chrome.storage.local.set({ TimeThisHour: 0}, function(){});
	chrome.storage.local.set({ TimeThisDay: 0}, function(){});
};
//========================END: save_options ========================================
