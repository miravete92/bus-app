var api='http://www.zaragoza.es/api/recurso/urbanismo-infraestructuras/transporte-urbano/poste/';

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
  	var resultElement = '';
  	Object.keys(state.stops).forEach(function(item) {
  		resultElement += '<div class="busStop">';
  		resultElement += '<h2>' + state.stops[item].title +'</h2>';
  		resultElement += '<button type="button" class="js-removestop">Remove</button>';
  		state.stops[item].destinos.forEach(function(bus) {
	    resultElement += 
		    '<div class="busTime">'+
		      '<h3>Línea ' + bus.linea + '</h3>'+
		      '<p>' + bus.primero + '</p>'+
		      '<p>' + bus.segundo + '</p>'+
		    '</div>';
		});
		resultElement += '</div>'
	    
	});
	
  

  $('.js-buses').html(resultElement);
}

function storeData(data) {
  if (data && !data.error) {
    state.stops["id"+data.id.substring(6)] = data; 
  }

  localStorage.setItem("stored",JSON.stringify(Object.keys(state.stops)));
  displayData();
}
function watchRemove(){
	$('.js-buses').on("click", ".js-removestop", function(e) {
    e.preventDefault();
    console.log("remove");
    var stopid = parseInt($(this).closest(".busStop").find("h2").text().substring(1));
    delete state.stops["id"+stopid];
    storeData(null);
  });
}

function updateScreen(){
	console.log("update screen");
	Object.keys(state.stops).forEach(function(item){
		getDataFromApi(item.substring(2), null);
	});
	displayData();
}
$(function(){
	
	watchSubmit();
	watchRemove();
	setInterval(updateScreen, 30000);

	if (localStorage.getItem("stored") !== null)
	{
		console.log(JSON.parse(localStorage.getItem("stored")));
		var keys = JSON.parse(localStorage.getItem("stored"));
		for(var i = 0;i<keys.length;i++){
			getDataFromApi(keys[i].substring(2), storeData);
		}
	}
});