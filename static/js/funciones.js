/*
	Pequeña cajita de herramientas de nekro
	
*/
/*
-----------------------------------------------------
	Funciones de include html
-----------------------------------------------------
*/
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    
	if (file) {
	  /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
		  if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }      
      xhttp.open("GET", file, true);
      xhttp.send();
      /*exit the function:*/
      return;
    }
  }
};

function loadExternalHTML(){
	var z, i, elmnt, file;
	/*loop through a collection of all HTML elements:*/
	z = document.getElementsByTagName("*");
	for (i = 0; i < z.length; i++) {
		elmnt = z[i];
		/*search for elements with a certain atrribute:*/
		file = elmnt.getAttribute("w3-include-html");
		
		// Cargo con jquery
		if (file) {
			$('#'+elmnt.id).load(file);			
		}
	}
}

function getParameter(parametro){
	var url_string = window.location.href;
	var url = new URL(url_string);
	var p = url.searchParams.get(parametro);
	return p;
}
/*
-----------------------------------------------------
	Funciones de tablas
-----------------------------------------------------
*/


/*

arrayTable
[
	[
		['pepe1','clase'],
		['pepe2','','idTD']
	],
	[
		['Juan1'],
		['Juan2']
	]
]
arrayTh
	['Header1','Header2']

generateTable([[['item1','clasePrueba'],['item2','','idprueba']],[['item3'],['item4','claseItem4','idItem4']]],['header1','header2'],'claseTable','idTable')
generateTable(arrayTable,arrayTH,'claseTable','idTable')
*/
function generateTable(arrayTable,arrayTH='',claseTable='',idTable='',attribs=''){
	var table='<table'+
				((claseTable!=''&&claseTable!=undefined)?' class="'+claseTable+'"':'')+
				((idTable!=''&&idTable!=undefined)?' id="'+idTable+'"':'')+
				((attribs!=''&&attribs!=undefined)?' '+attribs:'')+
				'>\n';
	if(arrayTH!=''&&arrayTH!=undefined){
		table+='\t<TR>\n';
		arrayTH.forEach(function(TH) {
			table+='\t\t<TH>\n'+
					'\t\t\t'+TH+'\n'+
					'\t\t</TH>\n';
		});
		table+='\t</TR>\n'
	}
	arrayTable.forEach(function(arrayTD) {
		table+='\t<TR>\n'
		arrayTD.forEach(function(TD){
			if (TD!=undefined){
				var valueTD=TD[0],classTD=TD[1],idTD=TD[2],attribTD=TD[3];
				table+='\t\t<TD'+ 
					((classTD!=undefined&&classTD!='')?' class="'+classTD+'"':'') +
					((idTD!=undefined&&idTD!='')?' id="'+idTD+'"':'') +
					((attribTD!=undefined&&attribTD!='')?' '+attribTD:'') +
					'>\n\t\t\t'+valueTD+'\n\t\t</TD>\n';
			}
		});
		table+='\t</TR>\n'
	});
	table+='</table>'
	return table
}

/*
-----------------------------------------------------
	Funciones numericas
-----------------------------------------------------
*/
function validateRandomizer(parentFunction, min, max, esInt, tipo, cantPos, arrayVerif){
	var msg='';
	//console.log(parentFunction+' '+min+' '+max+' '+esInt+' '+tipo+' '+cantPos+' '+arrayVerif);

	if(tipo==0||tipo==1){
		if(min>max){
			msg='[validateRandomizer:'+parentFunction+'] El min: '+min+' no puede ser mayor al maximo: '+max+'\n'
		}
	}
	if(tipo==0||tipo==1){
		if(min==max){
			msg='[validateRandomizer:'+parentFunction+'] El min: '+min+' no puede ser igual al maximo: '+max+'\n'
		}
	}
	if(tipo==1){
		if((max-min)<cantPos&&esInt){
			msg='[validateRandomizer:'+parentFunction+'] No hay suficientes posiciones('+cantPos+') si usamos INT para usar un minimo: '+min+' y un maximo: '+max+'\n'
		}
	}
	if (tipo==2){
		if(arrayVerif.length==0){
			msg='[validateRandomizer:'+parentFunction+'] La lista no puede estar vacia\n'
		}
	}
	
	
	if (msg===''){
		return true
	}else{
		console.log(msg);
		return false
	}
}

function randBetween(min, max, esInt){
	var tipo = 0, parentFunction = 'randBetween';
	if(!validateRandomizer(parentFunction,min, max, esInt, tipo)){return false};
	//console.log('validateRandomizer('+"'"+parentFunction+"'"+','+min+','+max+','+esInt+','+tipo+')');
	
	if(esInt){
		return Math.floor(Math.random()*(max-min+1)+min);
	}else{
		return Math.random()*(max-min)+min;
	}
}

function randBetweenUniqueArray(min, max, esInt, posiciones){
	var tipo = 1, parentFunction = 'randBetweenUniqueArray';
	if(!validateRandomizer(parentFunction,min, max, esInt, tipo, posiciones)){return false};
	//console.log('validateRandomizer('+"'"+parentFunction+"'"+','+min+','+max+','+esInt+','+tipo+','+posiciones+')');

	var arrayUnique=[];
		
	while (posiciones > arrayUnique.length){
		var nro = randBetween(min,max,esInt);
		var existe = false;
		arrayUnique.forEach(function(nroArray) {
			if(nro==nroArray){
				existe=true;
			}
		});
		if(!existe){
			arrayUnique.push(nro);
		}
	}
	return arrayUnique;
}

function randLista(arrayLista){
	var tipo = 2, parentFunction = 'randLista';
	var max = arrayLista.length-1, min=0,esInt=true,posiciones=1;
	if(!validateRandomizer(parentFunction,min, max, esInt, tipo, posiciones,arrayLista)){return false};
	//console.log('validateRandomizer('+"'"+parentFunction+"'"+','+min+','+max+','+esInt+','+tipo+','+posiciones+')');
	
	var id = randBetween(min,max,esInt);
	return arrayLista[id];
}

function randListaArray(arrayLista){
	var tipo = 2, parentFunction = 'randListaArray';
	var max = arrayLista.length-1, min=0,esInt=true,posiciones=1;
	if(!validateRandomizer(parentFunction,min, max, esInt, tipo, posiciones,arrayLista)){return false};
	//console.log('validateRandomizer('+"'"+parentFunction+"'"+','+min+','+max+','+esInt+','+tipo+','+posiciones+','+arrayLista+')');
		
	var arrayUnique=[];
	var existe = false;
	while (arrayLista.length > arrayUnique.length){
		var nro = randBetween(min,max,esInt);
		var existe = false;
		arrayUnique.forEach(
			function(nroArray) {
				if(nro==nroArray){
					existe=true;
				}
			}
		);
		if(!existe){
			arrayUnique.push(nro);
		}
	}	
	var arrayFinal=[];
	arrayUnique.forEach(
		function(idArray) {
			arrayFinal.push(arrayLista[idArray]);
		}
	);
	return arrayFinal;
}

/*
-----------------------------------------------------
	Ordenamientos
-----------------------------------------------------
*/
// ordenamiento burbuja
function bubbleSorting(arr,ordenarZA) {
	var len = arr.length;
	for (var i = 0; i < len ; i++) {
		for(var j = 0 ; j < len - i - 1; j++){
			if(ordenarZA){
				if (arr[j] < arr[j + 1]) {
					// cambiazo (es menor)
					var temp = arr[j+1];
					arr[j+1] = arr[j];
					arr[j] = temp;
				}
			}else{
				if (arr[j] > arr[j + 1]) {
					// cambiazo (es mayor)
					var temp = arr[j];
					arr[j] = arr[j+1];
					arr[j + 1] = temp;				
				}
			}
		}
	}
	return arr;
}
