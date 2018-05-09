/*
	Pequeña cajita de herramientas de nekro para google
	
*/
/*
-----------------------------------------------------
	Funciones de Sheets
-----------------------------------------------------
*/
function sheetsGet(ssId,sName,cRange,apiKey){
	//var url = "https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/?key={yourAPIKey}&includeGridData=true";  
	//var url = "https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{sheetName}!{cellRange}?key={yourAPIKey}";
	var url = 'https://sheets.googleapis.com/v4/spreadsheets/'+ssId+'/values/'+sName+'!'+cRange+'?key='+apiKey;
	console.log(url);
	url = 'https://sheets.googleapis.com/v4/spreadsheets/'+ssId+'/?key='+apiKey+'&includeGridData=true';  
	console.log(url);
	return
	axios.get(url)
	  .then(function (response) {
		console.log(response);                                                                                                                                                    
	  })
	  .catch(function (error) {
		console.log(error);                                                                                                                                                       
	  }); 
}
function sheetTest(){
	// trato de pegarle aca:
	// https://docs.google.com/spreadsheets/d/1BllJHrL6y9LKnONfpAZ-10Boq6FQeS9o7h8m8IvJqUg/edit#gid=0
	console.log(sheetsGet('1BllJHrL6y9LKnONfpAZ-10Boq6FQeS9o7h8m8IvJqUg','TestSheet','A2',''));
}

/*
-----------------------------------------------------
	Funciones de Maps
-----------------------------------------------------
*/

/*
	llamada por default= initGmaps('map',40.6700,-73.9400,40.6700,-73.9400,'Prueba',11,0)
	
	Centra y marca en el mapa la posicion
	posLatLng: posicion LatLng del centrado del mapa -- default:(40.6700, -73.9400), // New York
	markLatLng: posicion LatLng del marcador -- default:(40.6700, -73.9400)
	markTitle: titulo del marcador
	zoom: default = 11, intetesante = 16
	
	Requiere en el html <HEAD>:
	(acceso a las apis)
	
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js"></script>
	
	
	Requiere en el html <BODY>:
	(posicion donde se va a poner el mapa)
	
	<div id="map"></div>
	
	
	Requiere en los estilos:
	(Set a size for our map container, the Google Map will take up 100% of this container)
	
	<style type="text/css">
		#map {
			width: 750px;
			height: 500px;
		}
	</style>
*/

// When the window has finished loading create our google map below
//google.maps.event.addDomListener(window, 'load', init);
        
function initGmaps(idComponente,posLat,posLng,markLat,markLng,markTitle,zoom,IDStyleMapa) {
	if(idComponente===undefined){
		idComponente='map';
	}
	if(posLat===undefined||posLng===undefined){
		posLat=40.6700;
		posLng=-73.9400;
	}
	if(markLat===undefined||markLng===undefined){
		markLat=[40.6700];
		markLng=[-73.9400];
	}
	if(markTitle===undefined){
		markTitle='Prueba';
	}
	if(zoom===undefined){
		zoom=16;
	}	
	
	/*
		Aca pegar derecho el estilo de https://snazzymaps.com
		Si rompe usa el que esta por defecto
		0 es purple
		1 es pale purple
	*/
	var styleMapa=[
				[{"featureType":"all","elementType":"all","stylers":[{"visibility":"simplified"},{"hue":"#bc00ff"},{"saturation":"0"}]},{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#e8b8f9"}]},{"featureType":"administrative.country","elementType":"labels","stylers":[{"color":"#ff0000"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#3e114e"},{"visibility":"simplified"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"},{"color":"#a02aca"}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#2e093b"}]},{"featureType":"landscape.natural","elementType":"labels.text","stylers":[{"color":"#9e1010"},{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"labels.text.fill","stylers":[{"color":"#ff0000"}]},{"featureType":"landscape.natural.landcover","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#58176e"}]},{"featureType":"landscape.natural.landcover","elementType":"labels.text.fill","stylers":[{"visibility":"simplified"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#a02aca"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#d180ee"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#a02aca"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"off"},{"color":"#ff0000"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#a02aca"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#cc81e7"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"visibility":"simplified"},{"hue":"#bc00ff"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#6d2388"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#c46ce3"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#b7918f"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#280b33"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"simplified"},{"color":"#a02aca"}]}],
				[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":"-20"},{"color":"#a28bb5"},{"lightness":"50"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#a28bb5"},{"lightness":"-20"},{"saturation":"20"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#a28bb5"},{"saturation":"15"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#a28bb5"},{"lightness":"10"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#a28bb5"},{"lightness":"-40"},{"weight":1.2}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#a28bb5"},{"lightness":"-20"},{"saturation":"20"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#a28bb5"},{"lightness":"-25"},{"saturation":"20"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#a28bb5"},{"lightness":"-35"},{"saturation":"20"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#a28bb5"},{"lightness":"-35"},{"saturation":"20"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#a28bb5"},{"lightness":"-35"},{"saturation":"20"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a28bb5"},{"lightness":"-10"},{"saturation":"20"}]}]
			]
	// Basic options for a simple Google Map
	// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
	var mapOptions = {
		// How zoomed in you want the map to start at (always required)
		zoom: zoom,

		// The latitude and longitude to center the map (always required)
		center: new google.maps.LatLng(posLat, posLng), // New York

		// How you would like to style the map. 
		// This is where you would paste any style found on Snazzy Maps.
		styles: styleMapa[IDStyleMapa]
	};

	// Get the HTML DOM element that will contain your map 
	// We are using a div with id="map" seen below in the <body>
	var mapElement = document.getElementById(idComponente);

	// Create the Google Map using our element and options defined above
	var map = new google.maps.Map(mapElement, mapOptions);

	// Let's also add a marker while we're at it

	
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(markLat, markLng),
		map: map,
		title: markTitle
	});
	// var marker2 = new google.maps.Marker({
		// position: new google.maps.LatLng(40.6700,-73.9400),
		// map: map,
		// title: 'hardcodeado'
	// });
}

// llamada: initGmapsArray(idComponente,posLat,posLng,[[-34.598289,-58.420123,'Utn Medrano'],[-34.659792,-58.468368,'Campus UTN']],zoom,IDStyleMapa)
function initGmapsArray(idComponente,posLat,posLng,markLatLngArray,zoom,IDStyleMapa) {
	if(idComponente===undefined){
		idComponente='map';
	}
	if(posLat===undefined||posLng===undefined){
		posLat=40.6700;
		posLng=-73.9400;
	}
	if(markLatLngArray===undefined){
		markLat=[40.6700,-73.9400,'Prueba'];
	}

	if(zoom===undefined){
		zoom=16;
	}	
	
	/*
		Aca pegar derecho el estilo de https://snazzymaps.com
		Si rompe usa el que esta por defecto
		0 es default
		1 es purple
		2 es pale purple
	*/
	var styleMapa=[
				[],
				[{"featureType":"all","elementType":"all","stylers":[{"visibility":"simplified"},{"hue":"#bc00ff"},{"saturation":"0"}]},{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#e8b8f9"}]},{"featureType":"administrative.country","elementType":"labels","stylers":[{"color":"#ff0000"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#3e114e"},{"visibility":"simplified"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"},{"color":"#a02aca"}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#2e093b"}]},{"featureType":"landscape.natural","elementType":"labels.text","stylers":[{"color":"#9e1010"},{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"labels.text.fill","stylers":[{"color":"#ff0000"}]},{"featureType":"landscape.natural.landcover","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#58176e"}]},{"featureType":"landscape.natural.landcover","elementType":"labels.text.fill","stylers":[{"visibility":"simplified"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#a02aca"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#d180ee"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#a02aca"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"off"},{"color":"#ff0000"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#a02aca"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#cc81e7"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"visibility":"simplified"},{"hue":"#bc00ff"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#6d2388"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#c46ce3"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#b7918f"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#280b33"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"simplified"},{"color":"#a02aca"}]}],
				[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":"-20"},{"color":"#a28bb5"},{"lightness":"50"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#a28bb5"},{"lightness":"-20"},{"saturation":"20"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#a28bb5"},{"saturation":"15"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#a28bb5"},{"lightness":"10"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#a28bb5"},{"lightness":"-40"},{"weight":1.2}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#a28bb5"},{"lightness":"-20"},{"saturation":"20"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#a28bb5"},{"lightness":"-25"},{"saturation":"20"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#a28bb5"},{"lightness":"-35"},{"saturation":"20"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#a28bb5"},{"lightness":"-35"},{"saturation":"20"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#a28bb5"},{"lightness":"-35"},{"saturation":"20"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a28bb5"},{"lightness":"-10"},{"saturation":"20"}]}]
			]
	// Basic options for a simple Google Map
	// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
	var mapOptions = {
		// How zoomed in you want the map to start at (always required)
		zoom: zoom,

		// The latitude and longitude to center the map (always required)
		center: new google.maps.LatLng(posLat, posLng), // New York

		// How you would like to style the map. 
		// This is where you would paste any style found on Snazzy Maps.
		styles: styleMapa[IDStyleMapa]
	};

	// Get the HTML DOM element that will contain your map 
	// We are using a div with id="map" seen below in the <body>
	var mapElement = document.getElementById(idComponente);

	// Create the Google Map using our element and options defined above
	var map = new google.maps.Map(mapElement, mapOptions);

	// Let's also add a marker while we're at it
	markLatLngArray.forEach(function(posicion) {
			var lat=posicion[0],lng=posicion[1],titulo=posicion[2];
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(lat, lng),
				map: map,
				title: titulo
			});
		});
	/*
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(markLat, markLng),
		map: map,
		title: markTitle
	});
	var marker2 = new google.maps.Marker({
		position: new google.maps.LatLng(40.6700,-73.9400),
		map: map,
		title: 'hardcodeado'
	});
	*/
}

