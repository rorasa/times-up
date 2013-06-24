
// jQuery scripts
$(document).ready(function(){

	//Initialiser
	$("#forceStopOptions").hide();
	$("#notificationOptions").hide();
	
	restore_options();
  	
  	// Event listeners
  	$("#EnableNotification").change(function(){
  		save_options();
  		if( $("#EnableNotification").prop('checked') ){
  			$("#notificationOptions").show();
  		}else{
  			$("#notificationOptions").hide();
  		}
  	});
  	$("#NtfTime").change(save_options);
  	$("#EnableForceStop").change(function(){
  		save_options();
		if( $('#EnableForceStop').prop('checked') ){
    		$("#forceStopOptions").show();
		}else{
    		$("#forceStopOptions").hide();
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
  	
  	$("#EnableForceStopWarning").change(save_options);
  	$("#ResetButton").click(clear_data);
  	
  	$("#testRange").change(function(){
  		$("#testDisplay").text($("#testRange").val());
  	});
  	
});

// save option to local storage
function save_options() {

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
}

// restore previous set options from local storage
function restore_options() {
	
	chrome.storage.local.get({
       'Options': {} },
       function(storage) {
       
         // check if there is OptionNtf set ...
         if(storage.Options.hasOwnProperty("OptionNtf")){
         	$("#EnableNotification").prop('checked',storage.Options.OptionNtf);
         	if (storage.Options.OptionNtf){
         		$("#notificationOptions").show();
         	}else{
         		$("#notificationOptions").hide();
         	}
         }else{ // ... else default is true
         	$("#EnableNotification").prop('checked',true);
         	$("#notificationOptions").show();
         }
         
         // check if there is OptionNtfTime set ...
         if(storage.Options.hasOwnProperty("OptionNtfTime")){
         	if (storage.Options.OptionNtfTime == 5){
         		$('#Ntf5mins').prop('selected',true);
         	}else if (storage.Options.OptionNtfTime == 10){
         		$('#Ntf10mins').prop('selected',true);
         	}else if (storage.Options.OptionNtfTime == 20){
				$('#Ntf20mins').prop('selected',true);         	
         	}else if (storage.Options.OptionNtfTime == 30){
         		$('#Ntf30mins').prop('selected',true);
         	}else if (storage.Options.OptionNtfTime == 45){
         		$('#Ntf45mins').prop('selected',true);
         	}else if (storage.Options.OptionNtfTime == 60){
         		$('#Ntf1hours').prop('selected',true);
         	}else if (storage.Options.OptionNtfTime == 120){
         		$('#Ntf2hours').prop('selected',true);
         	}else if (storage.Options.OptionNtfTime == 180){
         		$('#Ntf3hours').prop('selected',true);
         	}
         }else{ // ... else default is 30 minutes
            $('#Ntf30mins').prop('selected',true);
         }
         
         // check if there is OptionFS set ...
         if(storage.Options.hasOwnProperty("OptionFS")){
         	$("#EnableForceStop").prop('checked',storage.Options.OptionFS);
         	if (storage.Options.OptionFS){
         		$("#forceStopOptions").show();
         	}else{
         		$("#forceStopOptions").hide();
         	}
         }else{ // ... else default is false
         	$("#EnableForceStop").prop('checked',false);
         }
         
         // check if there is OptionMaxCon set ...
         if(storage.Options.hasOwnProperty("OptionMaxCon")){
         	$("#MaxCon").val(storage.Options.OptionMaxCon);
         	if(storage.Options.OptionMaxCon>4){
         		$("#MaxConDisplay").text($("#MaxCon").val()+" minutes"  );
         	}else{
         		$("#MaxConDisplay").text("Disabled");
         	}         	
         }else{ // ... else default is 4
         	$("#MaxCon").val(4);
         	$("#MaxConDisplay").text("Disabled");
         }
         
         // check if there is OptionMaxPerDay set ...
         if(storage.Options.hasOwnProperty("OptionMaxPerDay")){
         	$("#MaxPerDay").val(storage.Options.OptionMaxPerDay);
         	if(storage.Options.OptionMaxPerDay>0){
         		$("#MaxPerDayDisplay").text($("#MaxPerDay").val()+" hours"  );
         	}else{
         		$("#MaxPerDayDisplay").text("Disabled");
         	}         	
         }else{ // ... else default is 0
         	$("#MaxPerDay").val(0);
         	$("#MaxPerDayDisplay").text("Disabled");
         }
         
         // check if there is OptionMaxPerHour set ...
         if(storage.Options.hasOwnProperty("OptionMaxPerHour")){
         	$("#MaxPerHour").val(storage.Options.OptionMaxPerHour);
         	if(storage.Options.OptionMaxPerHour>0){
         		$("#MaxPerHourDisplay").text($("#MaxPerHour").val()+" hours"  );
         	}else{
         		$("#MaxPerHourDisplay").text("Disabled");
         	}         	
         }else{ // ... else default is 0
         	$("#MaxPerHour").val(0);
         	$("#MaxPerHourDisplay").text("Disabled");
         }
         
         // check if there is OptionMaxOpen set ...
         if(storage.Options.hasOwnProperty("OptionMaxOpen")){
         	$("#MaxOpen").val(storage.Options.OptionMaxOpen);
         	if(storage.Options.OptionMaxOpen>0){
         		$("#MaxOpenDisplay").text($("#MaxOpen").val()+" hours"  );
         	}else{
         		$("#MaxOpenDisplay").text("Disabled");
         	}         	
         }else{ // ... else default is 0
         	$("#MaxOpen").val(0);
         	$("#MaxOpenDisplay").text("Disabled");
         }
                 
         // check if there is OptionFSWarning set ...
         if(storage.Options.hasOwnProperty("OptionFSWarning")){
         	$('#EnableForceStopWarning').prop('checked',storage.Options.OptionFSWarning); 	
         }else{  // ... else default is false
         	$('#EnableForceStopWarning').prop("checked", false);
         }
         
       });
       
}

// reset all local storage content
function clear_data(){

	var confirm = window.confirm("Your entire usage records and all setting will be reset.\n Are you sure about this?");
	if (confirm){
		chrome.storage.local.clear(function(){
			$('#console').text("clear all data");
			});
	}	
}