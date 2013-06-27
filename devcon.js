
$(document).ready(function(){
	init();
	
	$("#refresh").click(function(){
		refresh();
		console.log("load");
	});
	
	$("#record").click(function(){
		record();
		console.log("save");
	});
	
});


function init(){
	chrome.storage.local.get(
	null,
	function(storage){
		for(var key in storage){
		
			$(".option_body").append('<span class="option_section_bullet"></span>');
			$(".option_body").append(key+'<br>');
			
			if(key == "Options"){
				//console.log(storage[key]);
				for(var subkey in storage[key]){
					//console.log(subkey);
					$(".option_body").append(subkey+'<input type="text" class="devtext" id="'+subkey+'"><br>');
					$("#"+subkey).val(storage[key][subkey]);
				}
			}else{
				$(".option_body").append('<div class="option_section"><input type="text" class="devtext" id="'+key+'"></div>');
				$("#"+key).val(storage[key]);
			}			
			
		} 
	}
	);
}

function refresh(){
	chrome.storage.local.get(
	null,
	function(storage){
		for(var key in storage){			
			if(key == "Options"){
				for(var subkey in storage[key]){
					$("#"+subkey).val(storage[key][subkey]);
				}
			}else{
				$("#"+key).val(storage[key]);
			}			
			
		} 
	}
	);
}

function record(){
	chrome.storage.local.get(
	null,
	function(storage){
		for(var key in storage){			
			if(key == "Options"){
				var options ={};
				for(var subkey in storage[key]){
					options[subkey] = $("#"+subkey).val();
				}
				chrome.storage.local.set({Options: options}, function(){});
			}else{
				var data = {};
				data[key] = $("#"+key).val();
				chrome.storage.local.set(data, function(){});
			}						
		} 
	}
	);
}