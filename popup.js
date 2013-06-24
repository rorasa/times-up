
$(document).ready(function(){
    var Time = new Date();
    
    var currentTime = Time.getTime();
    var currentSession;
    
    chrome.storage.local.get({
       'SessionStartTime': {},
       'AlarmFired': {} },
       function(storage) {
         var startTime = storage.SessionStartTime;
         currentSession = (currentTime-startTime)/1000;
         $("#time").text(currentSession+" seconds");
         
         //var alarmFired = storage.AlarmFired;
         //$("#alarm").text(alarmFired);
       });
});
