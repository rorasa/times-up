// Copyright (c) 2013 White Rose Innovation. All rights reserved.
// Time's Up! popup.js
// Last modified: July 2013 by Wattanit Hotrakool

$(document).ready(function(){

    var Time = new Date();
    
    chrome.storage.local.get({
       'SessionStartTime': {},
       'AlarmFired': {},
       'Options': {},
       'TimeThisDay': {},
       'TimeThisHour': {},
       'OpenThisHour': {} },
       function(storage) {
         var startTime = storage.SessionStartTime;
         var currentTime = Time.getTime();
         var currentSession = Math.floor((currentTime-startTime)/1000);
         
         var nowTime = ""
         if(currentSession < 60){
         	nowTime = currentSession+" seconds";
         }else if(currentSession < 3600){
         	nowTime = Math.floor(currentSession/60)+" minutes";
         	if ((currentSession % 60)!= 0){
         		nowTime = nowTime+" "+(currentSession%60)+" seconds";
         	}
         }else{
        	nowTime = Math.floor(currentSession/3600)+" hours";
        	if ((currentSession %3600)!= 0){
        		nowTime = nowTime+" "+Math.floor((currentSession%3600)/60)+" minutes";
        	}
         }
         $("#time").text(nowTime);
         
         if(storage.Options.OptionFS){
         	$(".popup_report").show();
         	
         	if(storage.Options.OptionMaxCon > 4){
         		$("#MaxConMeter").show();
         		var currentTime = "";
         		var maxTime = "";
         		if (currentSession < 60){
         			currentTime = currentSession+" seconds";
         		}else if (currentSession <3600){
         			currentTime = Math.floor(currentSession/60)+" minutes";
         		}else{
         			currentTime = Math.floor(currentSession/3600)+" hours";
         		}
         		if (storage.Options.OptionMaxCon < 60){
         			maxTime = (storage.Options.OptionMaxCon)+" minutes";
         		}else{
         			maxTime = Math.floor(storage.Options.OptionMaxCon/60)+" hours";
         			if((storage.Options.OptionMaxCon % 60)!=0){
         				maxTime = maxTime+" "+Math.floor(storage.Options.OptionMaxCon % 60)+" minutes";
         			}
         		}         		
         		$("#ConMeterText").text(currentTime+" from "+maxTime);
         		var percent = Math.floor((currentSession/(storage.Options.OptionMaxCon*60))*100);
         		$("#MaxConMeter div span").css("width",percent+"%");
         	}
         	
         	if(storage.Options.OptionMaxPerDay > 0){
         		$("#MaxPerDayMeter").show();	
         		var currentTime = "";
         		if (storage.TimeThisDay < 60){
         			currentTime = storage.TimeThisDay+" minutes";
         		}else{
         			currentTime = Math.floor(storage.TimeThisDay/60)+" hours";
         		}
         		$("#PerDayMeterText").text(currentTime+" from "+storage.Options.OptionMaxPerDay+" hours");
         		var percent = Math.round((storage.TimeThisDay/(storage.Options.OptionMaxPerDay*60))*100);
         		$("#MaxPerDayMeter div span").css("width",percent+"%");
         	}
         	
         	if(storage.Options.OptionMaxPerHour > 0){
         		$("#MaxPerHourMeter").show();
         		$("#PerHourMeterText").text(storage.TimeThisHour+" minutes from "+storage.Options.OptionMaxPerHour+" minutes");
         		var percent = Math.round((storage.TimeThisHour/storage.Options.OptionMaxPerHour)*100);
         		$("#MaxPerHourMeter div span").css("width",percent+"%");
         	}
         	
         	if(storage.Options.OptionMaxOpen > 0){
         		$("#MaxOpenMeter").show();
         		$("#OpenMeterText").text(storage.OpenThisHour+" times from "+storage.Options.OptionMaxOpen+" times");
         		var percent = Math.round((storage.OpenThisHour/storage.Options.OptionMaxOpen)*100);
         		$("#MaxOpenMeter div span").css("width",percent+"%");
         	}
         	
         }
         //var alarmFired = storage.AlarmFired;
         //$("#alarm").text(alarmFired);
       });
       
});
