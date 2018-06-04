/*
	Pequeña cajita de herramientas para la pagina de wf
*/
/*
	Variables globales
*/
var fetching=false;
var resultJson='';

var timer1='';
var counter1=0;
var counter1Max=15;

var completado=[];

var sounds=[];

function getWFWorldstate(proxy=false){
	var dataJson=getJson("https://ws.warframestat.us/pc",proxy);
}

function getJson(url='',viaCors=true){
	fetching=true;
	if(viaCors){
		// cors sirve como proxy externo
		//http://cors.io/?u=http://content.warframe.com/dynamic/worldState.php
		url="http://cors.io/?u="+url;
	}
	var request = new XMLHttpRequest();
	request.open('GET', url);
	request.responseType = 'json';
	request.send();
	request.onload = function() {
	  resultJson = request.response;
	  //alert(dataJson['USD']['transferencia']);
	  // console.log(request.response);
	  fetching=false;
	  return request.response;
	}
}

function startAll(){
	getWFWorldstate();
	setClock(1000,timerTime);
}
function timerTime(){
	rellenarDatos();
	if (!fetching){
		counter1++
		if (counter1>=counter1Max){
			getWFWorldstate();
			counter1=0;
		}
	}
}

function rellenarDatos(){
	var estado='';
	estado='<p class='+((fetching)?'infoFetch':'infoNoFetch')+'>';
	estado+='('+tiempoStr()+') Proximo fetch:'+(counter1Max-counter1)+'</p>';
	datosPagina.innerHTML=estado;
	barraProgreso.innerHTML='<progress value='+counter1+' max='+(counter1Max-1)+' class="barraProgreso"/>';
	if (resultJson!=''){
		var ths=[];
		var tds=[];
		var parseado='';

		//var diff=moment(new Date()).utc()-moment(resultJson.timestamp);
		//getMilliseconds()
		var diff=new Date(new Date().toUTCString())-moment(resultJson.timestamp);
		
		//Timestamp
		timeStamp.innerHTML='Timestamp: '+resultJson.timestamp;
		// timeStamp.innerHTML+= '<BR>Local UTF<BR> '+new Date(new Date().toUTCString()).getTime();
		// timeStamp.innerHTML+= '<BR>Local<BR> '+(new Date()).getTime();
		// timeStamp.innerHTML+= '<BR>JSON<BR> '+new Date(resultJson.timestamp).getTime();
		// timeStamp.innerHTML+= '<BR>UTC JSON<BR> '+moment(resultJson.timestamp).utc();
		// timeStamp.innerHTML+= '<BR>DIFF<BR>'+diff;
		
		//CetusTimer
		timers.innerHTML='<h3>Timers</h3>';
		timers.innerHTML+='<div>Cetus Timer: <p class='+((resultJson.cetusCycle.isDay)?'pDay':'pNight')+'>'+strDiff(resultJson.cetusCycle.timeLeft,diff) + '</p></div>';
		timers.innerHTML+='<div>Earth Timer: <p class='+((resultJson.earthCycle.isDay)?'pDay':'pNight')+'>'+strDiff(resultJson.earthCycle.timeLeft,diff) + '</p></div>';
		//Alerts
		ths=[];
		tds=[];
		parseado='<h3>Alertas</h3>'
		var alertsData=resultJson.alerts;
		ths.push([['Tiempo','alertTH'],['Mods','alertTH'],['Tipo Mision','alertTH'],['Nodo','alertTH'],['Faccion','alertTH'],['Nivel','alertTH'],['Reward','alertTH']])
		alertsData.forEach(function(a){
			var td=[];
			var idFaction=a.mission.faction.toLowerCase();
			var idAlerta="'"+a.id+"'";
			var alertaCompleta=chequearCompleto(a.id);
			var checkBoxCompleted='<label><input type="checkbox" onclick="toggleCompletar('+idAlerta+')"'+(alertaCompleta?' checked':'')+'>Completa?</label><br>'
			var isCompleted=(alertaCompleta?' completed':'');

			td.push([checkBoxCompleted+'<img src="'+a.mission.reward.thumbnail +'"><BR>'+ strDiff((a.eta),diff)+'('+a.eta+')','tdAlert '+idFaction]);
			var modifs='';
			(a.mission.nightmare?modifs+='N ':'');
			(a.mission.archwingRequired?modifs+='Aw ':'');
			td.push([modifs,'tdAlert '+idFaction+isCompleted]);
			modifs='';
			modifs=(a.mission.maxWaveNum!=undefined&&a.mission.maxWaveNum!='')?'Waves:'+ a.mission.maxWaveNum :'';
			modifs=(modifs!='')?' ('+modifs+')':'';
			td.push([a.mission.type+modifs,'tdAlert '+idFaction+ isCompleted]);
			td.push([a.mission.node,'tdAlert '+idFaction+ isCompleted]);
			td.push([idFaction.toUpperCase(),'tdAlert '+idFaction+ isCompleted]);
			td.push([a.mission.minEnemyLevel+'-'+a.mission.maxEnemyLevel,'tdAlert '+idFaction+ isCompleted]);
			td.push([a.mission.reward.asString,'tdAlert '+idFaction+ isCompleted]);
			if (!a.expired){tds.push(td);}
		});
		parseado += generateTable(tds,ths,'tableAlerts enlargeMe','','');
		parseado += '<hr>';
		alerts.innerHTML=parseado;
		
		//Invasions
		ths=[];
		tds=[];
		parseado='<h3>Invasiones</h3>'
		parseado+='<div>Construcciones:'
		parseado+='<ul><li class="grineer">Fomorian: '+resultJson.constructionProgress.fomorianProgress+'%</li>'
		parseado+='<li class="corpus">RazorBack: '+resultJson.constructionProgress.razorbackProgress+'%</li>'
		parseado+='<li class="infested">Unknown: '+resultJson.constructionProgress.unknownProgress+'%</li></ul></div'
		
		var invasionData=resultJson.invasions;
		ths.push([['Descripcion Mision','invTH'],['Nodo','invTH'],['Porcentaje','invTH'],['Ataca','invTH'],['Reward A','invTH'],['Defiende','invTH'],['Reward D','invTH'],['VS infested','invTH']])
		invasionData.forEach(function(inv){
			var td=[];
			if (!inv.completed){
				var atk=inv.attackingFaction.toLowerCase();
				var def=inv.defendingFaction.toLowerCase();
				var idInvasion="'"+inv.id+"'";
				var invasionCompleta=chequearCompleto(inv.id);
				var checkBoxCompleted='<label><input type="checkbox" onclick="toggleCompletar('+idInvasion+')"'+(invasionCompleta?' checked':'')+'>Completa?</label><br>'
				var isCompleted=(invasionCompleta?' completed':'');

				td.push([checkBoxCompleted+inv.desc,'tdInvasion '+((Math.round(inv.completion,5))>50?atk:def)]);
				td.push([inv.node,'tdInvasion '+((Math.round(inv.completion,5))>50?atk:def)+isCompleted]);
				td.push(['<div class=progressInv'+((Math.round(inv.completion,5))>50?atk:def)+'><progress value='+inv.completion+' max=100 /></div>'+Math.round(inv.completion,5)+'% - '+strDiff(inv.eta,diff),'tdInvasion '+((Math.round(inv.completion,5))>50?atk:def)+isCompleted]);
				td.push([inv.attackingFaction.toUpperCase(),'tdInvasion '+atk+isCompleted]);
				td.push(['<img src="'+inv.attackerReward.thumbnail +'"><BR>'+ inv.attackerReward.asString,'tdInvasion '+atk+isCompleted]);
				td.push([inv.defendingFaction.toUpperCase(),'tdInvasion '+def+isCompleted]);
				td.push(['<img src="'+inv.defenderReward.thumbnail +'"><BR>'+ inv.defenderReward.asString,'tdInvasion '+def+isCompleted]);
				td.push([inv.vsInfestation,'tdInvasion '+def+isCompleted]);
				tds.push(td);	
			}
		});

		parseado += '<div class="tableInvasion enlargeMe">'+generateTable(tds,ths,'tableInvasion','','border="1px solid white"')+'</div>';
		parseado += '<hr>';
		invasions.innerHTML=parseado;

		//Sortie
		ths=[];
		tds=[];
		parseado='';
		var sortieData=resultJson.sortie;
		parseado = 	'<h3>Sortie ('+sortieData.boss+'-'+sortieData.faction+'-'+strDiff((sortieData.eta),diff)+')</h3><div>Jefe: '+sortieData.boss;
		parseado += '<BR>Faccion: '+sortieData.faction;
		parseado += '<BR>Tiempo Restante: '+strDiff((sortieData.eta),diff)+'('+sortieData.eta+')</div>';
		var sortieFaction=sortieData.faction.toLowerCase();
		ths.push([['Tipo Mision'],['Nodo'],['Modificador'],['Descripcion Modificador']]);
		sortieData.variants.forEach(function(v){
			var idSortie="'"+v.missionType+v.node+v.modifier+"'";
			var sortieCompleta=chequearCompleto(v.missionType+v.node+v.modifier);
			var checkBoxCompleted='<label><input type="checkbox" onclick="toggleCompletar('+idSortie+')"'+(sortieCompleta?' checked':'')+'>Completa?</label><br>'
			var isCompleted=(sortieCompleta?' completed':'');
			
			var td=[];
			td.push([checkBoxCompleted+v.missionType,'tdSortie '+sortieFaction]);
			td.push([v.node,'tdSortie '+sortieFaction+isCompleted]);
			td.push([v.modifier,'tdSortie '+sortieFaction+isCompleted]);
			td.push([v.modifierDescription,'tdSortie '+sortieFaction+isCompleted]);
			tds.push(td);	
		});
		parseado += generateTable(tds,ths,'tableSortie enlargeMe','','');
		parseado +='<hr>';
		sortie.innerHTML=parseado;
		
		//Fisures
		parseado='';
		var fisureData=resultJson.fissures;
		parseado = 	'<h3>Fisures</h3>';
		ths=[];
		tds=[];
		ths.push([['Tier'],['Tiempo'],['Enemigo'],['Tipo'],['Nodo']]);
		
		fisureData.forEach(function(f){
			var td=[];
			var fisureFaction=f.enemy.toLowerCase();
			td.push([f.tier+' ('+f.tierNum+')','tdFisure '+fisureFaction]);
			td.push([strDiff(f.eta,diff),'tdFisure '+fisureFaction]);
			td.push([f.enemy,'tdFisure '+fisureFaction]);
			td.push([f.missionType,'tdFisure '+fisureFaction]);
			td.push([f.node,'tdFisure '+fisureFaction]);
			tds.push(td);	
		});
		parseado += generateTable(tds,ths,'tableFisures enlargeMe','','');
		parseado +='<hr>';
		fissures.innerHTML=parseado;
		//Baro
		var baroData=resultJson.voidTrader;
		parseado='<h3>'+baroData.character+' - ('+(baroData.active?'Activo! Se va: '+strDiff((baroData.endString),diff):'Esperando, llega: '+strDiff((baroData.startString),diff))+')</h3>'
		parseado+=baroData.character+
			'<BR>Llega a: '+baroData.location+' Activo: '+baroData.active+
			'<BR>Llega: '+strDiff((baroData.startString),diff)+' Se va: '+strDiff((baroData.endString),diff)+
			'<BR>Inventario: '+baroData.inventory;
		parseado +='<hr>';
		baro.innerHTML=parseado;
		//News
		var newsData=resultJson.news;
		parseado='<h3>News</h3>';
		parseado+='<ul class="news enlargeMe">';
		newsData.forEach(function(n){
			parseado+='<li><img src="'+n.imageLink+'" alt="'+n.message+'">['+strDiff(n.eta, diff*-1)+']<a href="'+n.link+'" target="blank">'+n.message+'</a></li>'
		});
		parseado +='</ul><hr>';
		news.innerHTML=parseado;
	}
}
function toggleHide(id){
	document.getElementById(id).classList.toggle("hidden");
}
function strToDate(stringDate){
	var res=stringDate.split(" ");
	var response=0;
	res.forEach(function(t){
		var caracter=t.substring(t.length-1);
		
		t=t.substring(0,t.length-1);
		switch (caracter){
		case 'd':
			response+=t*1000*60*60*24;
			break;		
		case 'h':
			response+=t*1000*60*60;
			break;
		case 'm':
			response+=t*1000*60;
			break;
		case 's':
			response+=t*1000;
			break;
		case 'a':
		case 'g':
		case 'o':
			break;
		default:
			console.log('*'+t+'*'+caracter+'* default');
		}
	});
	return response;
}

function strDiff(strDate, diff){
	var result = strToDate(strDate)-diff;
	//result=new Date(result+ (new Date().getTimezoneOffset() * 60000));

	dias=new Date(result+ (new Date().getTimezoneOffset() * 60000)).getDate();
	horas=new Date(result+ (new Date().getTimezoneOffset() * 60000)).getHours();
	minutos=new Date(result+ (new Date().getTimezoneOffset() * 60000)).getMinutes();
	segundos=new Date(result+ (new Date().getTimezoneOffset() * 60000)).getSeconds();
	//test.innerHTML=dias +''+horas +''+ minutos +''+ segundos;
	//test.innerHTML=new Date(result+ (new Date().getTimezoneOffset() * 60000));	dias=(dias=31)?0:dias;
	// if(dias!=31){
	// 	result='-FINALIZADO-';
	// }else{
		dias=(dias!=1&&dias!=31)?fillStr(dias, 2)+'dias ':'';

		horas=(horas!=0)?fillStr(horas, 2)+'h ':'';
		minutos=(minutos!=0)?fillStr(minutos, 2)+'m ':'';
		segundos=fillStr(segundos, 2)+'s ';

		result=dias +''+horas+''+minutos+''+segundos;
	// }

	return result;
}

// funciones de completado
function toggleCompletar(id){
	var pos=-1;
	var posElemento=-1;
	//if (completado.includes(id)){alert("existe");}
	completado.forEach(function(valor){
		pos++;
		if (valor==id){
			posElemento=pos;
		}
	});

	if(posElemento!=-1){
		//console.log(completado);
		completado.splice(posElemento, 1);
		// console.log("eliminado:" +id+'\n'+completado);
	}else{
		completado.push(id);
		// console.log("agregado:" +id+'\n'+completado);
	}
	timerTime();
/*	if (completado.includes(id)){
		completado.
	}else{
		completado.push(id);
	}*/

}
function chequearCompleto(id){
	var pos=-1;
	var posElemento=-1;
	completado.forEach(function(valor){
		pos++;
		if (valor==id){
			posElemento=pos;
			// console.log(id);
		}
	});
	// if (completado.includes(id)){alert (id+' aparece!');}
	// console.log("pregunto por: "+id);
	if(posElemento>-1){
		return true;
	}else{
		return false;
	}

}

function cargarSonido(source='', soundControl){
	if (source==''){return false;}
	if (source=='Hablado'){textToSpeach(source);return;}
	source='static/sound/alerts/'+source;
	soundControl.src =source;
	soundControl.load();
	soundControl.play();
}

function textToSpeach(text){
	var msg = new SpeechSynthesisUtterance(text);
	window.speechSynthesis.speak(msg);
}