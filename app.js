var api='https://www.zaragoza.es/api/recurso/urbanismo-infraestructuras/transporte-urbano/poste/';

var state = {stops:[]};
function getDataFromApi(stopId, callback) {
	console.log("Get Data call: "+stopId);
  $.getJSON(api+"tuzsa-"+stopId+".json", null, callback);
}

function watchSubmit() {
  $('.busForm').submit(function(e) {
  	console.log("submit");
    e.preventDefault();
    var query = $(this).find('input[type="number"]').val();
    getDataFromApi(query, storeData);
  });
}
function displayData() {
	console.log("Displaying Data");
  	var resultElement = '';
  	Object.keys(state.stops).forEach(function(item) {
  		resultElement += '<div class="busStop">';
  		resultElement += '<h2>' + state.stops[item].title +'</h2>';
  		resultElement += '<button type="button" class="js-removestop">Remove</button>';
  		state.stops[item].destinos.forEach(function(bus) {
	    resultElement += 
		    '<div class="busTime">'+
		      '<h3>Line ' + bus.linea + '</h3>'+
		      '<p>' + bus.primero + '</p>'+
		      '<p>' + bus.segundo + '</p>'+
		    '</div>';
		});
		resultElement += '</div>'
	    
	});
	
  

  $('.js-buses').html(resultElement);
}

function storeData(data) {
  if (data) {
  	if(!data.error)
    	state.stops["id"+data.id.substring(6)] = data; 
    else
    	window.alert("Bus stop does not exist");
  }

  localStorage.setItem("stored",JSON.stringify(Object.keys(state.stops)));
  displayData();
}
function updateData(data) {
  if (data && !data.error) {
    state.stops["id"+data.id.substring(6)] = data; 
  }
  displayData();
}
function watchRemove(){
	$('.js-buses').on("click", ".js-removestop", function(e) {
    e.preventDefault();
    if(window.confirm("Do you want to delete this bus stop?")){
    	console.log("remove");
	    var stopid = parseInt($(this).closest(".busStop").find("h2").text().substring(1));
	    delete state.stops["id"+stopid];
	    storeData(null);
    }
    
  });
}
function watchMoveUp(){
	$('.js-buses').on("click", ".js-moveUp", function(e) {
    e.preventDefault();
    var stopid = parseInt($(this).closest(".busStop").find("h2").text().substring(1));
    //delete state.stops["id"+stopid];
    storeData(null);
  });
}
function watchMoveDown(){
	$('.js-buses').on("click", ".js-moveDown", function(e) {
    e.preventDefault();
    var stopid = parseInt($(this).closest(".busStop").find("h2").text().substring(1));
    //delete state.stops["id"+stopid];
    storeData(null);
  });
}

function updateScreen(){
	console.log("update screen");
	Object.keys(state.stops).forEach(function(item){
		getDataFromApi(item.substring(2), updateData);
	});
	displayData();
}
$(function(){
	window.addEventListener("load",function() {
		setTimeout(function(){
			// This hides the address bar:
			window.scrollTo(0, 1);
		}, 0);
	});
	watchSubmit();
	watchRemove();
	setInterval(updateScreen, 30000);

	if (localStorage.getItem("stored") !== null)
	{
		var keys = JSON.parse(localStorage.getItem("stored"));
		for(var i = 0;i<keys.length;i++){
			getDataFromApi(keys[i].substring(2), updateData);
		}
	}
});