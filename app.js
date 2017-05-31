/*The api whick brings bus stop information*/
var api='https://www.zaragoza.es/api/recurso/urbanismo-infraestructuras/transporte-urbano/poste/';

/*Stores the state of the application*/
var state = {stops:[]};

/**Calls the API and retrieves the information into a callback function*/
function getDataFromApi(stopId, callback) {
	console.log("Get Data call: "+stopId);
  $.getJSON(api+"tuzsa-"+stopId+".json", null)  
    .done(callback)
    .fail(function( jqxhr, textStatus, error ) {
      window.alert("Bus stop does not exist");
    });
}

/**Handle Find button click*/
function watchSubmit() {
  $('.busForm').submit(function(e) {
  	console.log("submit");
    e.preventDefault();
    var query = $(this).find('input[type="number"]').val();
    getDataFromApi(query, storeData);
  });
}
/**Updates HTML elements*/
function displayData() {
	console.log("Displaying Data");
  	var resultElement = '';
  	Object.keys(state.stops).forEach(function(item) {
  		resultElement += '<div class="busStop">';
  		resultElement += '<h2>' + state.stops[item].title +'</h2>';
  		resultElement += '<button type="button" class="js-removestop">&#x2716;</button>';
  		state.stops[item].destinos.forEach(function(bus) {
	    resultElement += 
		    '<div class="busTime">'+
		      '<h3>Line ' + bus.linea + '</h3>'+
		      '<p>' + bus.primero.replace("minutos.", "min'").replace("Sin estimacin.", "Unkn.") + '</p>'+
		      '<p>' + bus.segundo.replace("minutos.", "min'").replace("Sin estimacin.", "Unkn.") + '</p>'+
		    '</div>';
		});
		resultElement += '</div>'
	    
	});
	
  

  $('.js-buses').html(resultElement);
}
/**Parses the data obtained from the API, stores it in browser*/
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

/**Parses the data obtained from the API, and updates the view*/
function updateData(data) {
  if (data && !data.error) {
    state.stops["id"+data.id.substring(6)] = data; 
  }
  displayData();
}

/**Handle Remove button click for every bus stop*/
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

/**Updates all the information about bus stops and displays*/
function updateScreen(){
	console.log("update screen");
	Object.keys(state.stops).forEach(function(item){
		getDataFromApi(item.substring(2), updateData);
	});
	displayData();
}

/**On load page*/
$(function(){
	watchSubmit();
	watchRemove();
  //Every 30 seconds updates the information
	setInterval(updateScreen, 30000);

  //Retrieves the previuos state stored in browser
	if (localStorage.getItem("stored") !== null)
	{
		var keys = JSON.parse(localStorage.getItem("stored"));
		for(var i = 0;i<keys.length;i++){
			getDataFromApi(keys[i].substring(2), updateData);
		}
	}
});