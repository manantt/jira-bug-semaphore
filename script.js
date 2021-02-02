// ==UserScript==
// @name         Jira bug semaphore
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  Displays bugs count by colors according to priority
// @author       Manantt
// @match        http://intranet.jira.es/*
// @grant        none
// ==/UserScript==
var rutaReabiertosPropios = 'http://intranet.jira.es/issues/?jql=status%20%3D%20Reopened%20and%20assignee%20%3D%20currentUser()%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC';
var tickets = {
    "pruebas" : {
        "cantidad" : 0,
        "title":"En pruebas",
        "color" : "rgb(100, 0, 0)",
        "borde" : "rgb(25, 0, 0)",
        "ruta" : 'http://intranet.jira.es/issues/?jql=status%20%3D%20Pruebas%20%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC'
    },
    "revision" : {
        "cantidad" : 0,
        "title":"En revisión",
        "color" : "rgb(50, 0, 0)",
        "borde" : "rgb(25, 0, 0)",
        "ruta" : "http://intranet.jira.es/issues/?jql=status%20%3D%20\'En%20revision\'%20%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC"
    },
    "pullrequest" : {
        "cantidad" : 0,
        "title":"Pull request",
        "color" : "rgb(50, 50, 0)",
        "borde" : "rgb(25, 25, 0)",
        "ruta" : "http://intranet.jira.es/issues/?jql=status%20%3D%20\'Pull%20request\'%20%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC"
    },
    "bloqueante" : {
        "cantidad" : 0,
        "title":"Bloqueantes",
        "color" : "rgb(206, 0, 0)",
        "borde" : "rgb(133, 0, 0)",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20%3D%20NeT10-Bugs%20AND%20priority%20in%20(Bloqueante)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20AND%20type%20%3D%20Error%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC'
    },
    "alta" : {
        "cantidad" : 0,
        "title":"Prioridad alta",
        "color" : "rgb(234, 68, 68)",
        "borde" : "rgb(176, 19, 19)",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20%3D%20NeT10-Bugs%20AND%20priority%20in%20(Alta)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20AND%20type%20%3D%20Error%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC'
    },
    "media" : {
        "cantidad" : 0,
        "title":"Prioridad media",
        "color" : "rgb(234, 125, 36)",
        "borde" : "rgb(160, 80, 15)",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20%3D%20NeT10-Bugs%20AND%20priority%20in%20(Media)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20AND%20type%20%3D%20Error%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC'
    },
    "baja" : {
        "cantidad" : 0,
        "title":"Prioridad baja",
        "color" : "rgb(42, 135, 53)",
        "borde" : "rgb(27, 87, 34)",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20%3D%20NeT10-Bugs%20AND%20priority%20in%20(Baja)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20AND%20type%20%3D%20Error%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC'
    },
    "muybaja" : {
        "cantidad" : 0,
        "title":"Prioridad muy baja",
        "color" : "rgb(85, 165, 87)",
        "borde" : "rgb(55, 107, 56)",
        "ruta" : "http://intranet.jira.es/issues/?jql=project%20%3D%20NeT10-Bugs%20AND%20priority%20in%20(\'Muy%20baja\')%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20AND%20type%20%3D%20Error%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC"
    },
    "reabierto" : {
        "cantidad" : 0,
        "title":"Reabierto",
        "color" : "rgb(165, 165, 165)",
        "borde" : "rgb(107, 107, 107)",
        "ruta" : "http://intranet.jira.es/issues/?jql=status%20%3D%20Reopened%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC"
    },
    "confexterna" : {
        "cantidad" : 0,
        "title":"Confirmación externa",
        "color" : "rgb(85, 165, 87)",
        "borde" : "rgb(55, 107, 56)",
        "ruta" : "http://intranet.jira.es/issues/?jql=status%20%3D%20'Confirmación%20externa'%20%20%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC"
    },
};
var SVG_BUGS = '<svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="bug" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-bug fa-w-16 fa-2x"><g class="fa-group"><path class="alerta" fill="#555" d="M369 112H145a112 112 0 0 1 224 0z" class="fa-secondary"></path><path fill="#888" d="M512 288.9c-.48 17.43-15.22 31.1-32.66 31.1H424v16a143.4 143.4 0 0 1-13.6 61.14l60.23 60.23a32 32 0 0 1-45.26 45.26l-54.73-54.74A143.42 143.42 0 0 1 280 480V236a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v244a143.42 143.42 0 0 1-90.64-32.11l-54.73 54.74a32 32 0 0 1-45.26-45.26l60.23-60.23A143.4 143.4 0 0 1 88 336v-16H32.67C15.23 320 .49 306.33 0 288.9A32 32 0 0 1 32 256h56v-58.74l-46.63-46.63a32 32 0 0 1 45.26-45.26L141.25 160h229.49l54.63-54.63a32 32 0 0 1 45.26 45.26L424 197.26V256h56a32 32 0 0 1 32 32.9z" class="fa-primary"></path></g></svg>';
var SVG_PROP = '<svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="user" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-user fa-w-14 fa-2x"><g class="fa-group"><path class="alerta" fill="#555" d="M352 128A128 128 0 1 1 224 0a128 128 0 0 1 128 128z" class="fa-secondary"></path><path fill="#888" d="M313.6 288h-16.7a174.1 174.1 0 0 1-145.8 0h-16.7A134.43 134.43 0 0 0 0 422.4V464a48 48 0 0 0 48 48h352a48 48 0 0 0 48-48v-41.6A134.43 134.43 0 0 0 313.6 288z" class="fa-primary"></path></g></svg>';
var SVG_REAB = '<svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="redo" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-redo fa-w-16 fa-2x"><g class="fa-group"><path fill="#888" d="M422.36 422.69a12 12 0 0 1 0 17l-.49.46A247.1 247.1 0 0 1 255.67 504c-136.9 0-247.9-110.93-248-247.81C7.57 119.53 119 8 255.67 8a247.45 247.45 0 0 1 188.9 87.33l3.52 64.43-46.5-2.22A176 176 0 1 0 372 388.15a12 12 0 0 1 16.38.54z" class="fa-secondary"></path><path class="alerta" fill="#555" d="M512 12v200a12 12 0 0 1-12 12H300a12 12 0 0 1-12-12v-47.32a12 12 0 0 1 12-12h.58l147.54 7.06-7.44-147.19A12 12 0 0 1 452.07 0H500a12 12 0 0 1 12 12z" class="fa-primary"></path></g></svg>';
var SVG_REV = '<svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="search" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-search fa-w-16 fa-2x"><g class="fa-group"><path class="alerta" fill="#555" d="M208 80a128 128 0 1 1-90.51 37.49A127.15 127.15 0 0 1 208 80m0-80C93.12 0 0 93.12 0 208s93.12 208 208 208 208-93.12 208-208S322.88 0 208 0z" class="fa-secondary"></path><path fill="#888" d="M504.9 476.7L476.6 505a23.9 23.9 0 0 1-33.9 0L343 405.3a24 24 0 0 1-7-17V372l36-36h16.3a24 24 0 0 1 17 7l99.7 99.7a24.11 24.11 0 0 1-.1 34z" class="fa-primary"></path></g></svg>';
var SVG_PRUE = '<svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="vial" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512" class="svg-inline--fa fa-vial fa-w-15 fa-2x"><g class="fa-group"><path class="alerta" fill="#555" d="M318 256L138.61 435.44a55.46 55.46 0 0 1-78.39.06 55.46 55.46 0 0 1-.09-78.44L161 256z" class="fa-secondary"></path><path fill="#888" d="M477.65 186.12L309.45 18.33a8 8 0 0 0-11.3 0l-34 33.9a8 8 0 0 0 0 11.29l11.2 11.1L33 316.53c-38.8 38.69-45.1 102-9.4 143.5a102.44 102.44 0 0 0 78 35.9h.4a102.75 102.75 0 0 0 72.9-30.09l246.3-245.71 11.2 11.1a8 8 0 0 0 11.3 0l34-33.89a7.92 7.92 0 0 0-.05-11.22zM141 431.84a54.65 54.65 0 0 1-38.95 16h-.36A54.09 54.09 0 0 1 60 428.76c-8.67-10.08-12.85-23.53-11.76-37.86a64.77 64.77 0 0 1 18.61-40.4l242.4-241.9 78 77.54z" class="fa-primary"></path></g></svg>';
var SVG_PULL = '<svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="upload" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-upload fa-w-16 fa-2x"><g class="fa-group"><path fill="#888" d="M488 351.92H352v8a56 56 0 0 1-56 56h-80a56 56 0 0 1-56-56v-8H24a23.94 23.94 0 0 0-24 24v112a23.94 23.94 0 0 0 24 24h464a23.94 23.94 0 0 0 24-24v-112a23.94 23.94 0 0 0-24-24zm-120 132a20 20 0 1 1 20-20 20.06 20.06 0 0 1-20 20zm64 0a20 20 0 1 1 20-20 20.06 20.06 0 0 1-20 20z" class="fa-secondary"></path><path class="alerta" fill="#555" d="M192 359.93v-168h-87.7c-17.8 0-26.7-21.5-14.1-34.11L242.3 5.62a19.37 19.37 0 0 1 27.3 0l152.2 152.2c12.6 12.61 3.7 34.11-14.1 34.11H320v168a23.94 23.94 0 0 1-24 24h-80a23.94 23.94 0 0 1-24-24z" class="fa-primary"></path></g></svg>';

(function() {
    crearSemaforo();
    crearDashboard();
})();

$.post( tickets['pruebas']['ruta'], function( data ) {
    var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
    if(typeof cantidad == "undefined"){
        cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
    }
    $(".boton-pruebas").html(cantidad);
    $(".num.pruebas span").html(cantidad);
    if(cantidad > 0){
        $(".pruebas .alerta").attr("class", "alertando");
    }
});
$.post( tickets['revision']['ruta'], function( data ) {
    var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
    if(typeof cantidad == "undefined"){
        cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
    }
    $(".boton-revision").html(cantidad);
    $(".num.rev span").html(cantidad);
    if(cantidad > 0){
        $(".rev .alerta").attr("class", "alertando");
    }
});
$.post( tickets['pullrequest']['ruta'], function( data ) {
    var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
    if(typeof cantidad == "undefined"){
        cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
    }
    $(".boton-pullrequest").html(cantidad);
    $(".num.pull span").html(cantidad);
    if(cantidad > 0){
        $(".pull .alerta").attr("class", "alertando");
    }
});
$.post( tickets['bloqueante']['ruta'], function( data ) {
    var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
    if(typeof cantidad == "undefined"){
        cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
    }
    $(".boton-bloqueante").html(cantidad);
    $(".num.bugs span").html(cantidad);
    if(cantidad > 0){
        $(".bugs .alerta").attr("class", "alertando");
    }
});
$.post( tickets['alta']['ruta'], function( data ) {
    var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
    if(typeof cantidad == "undefined"){
        cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
    }
    $(".boton-alta").html(cantidad);
});
$.post( tickets['media']['ruta'], function( data ) {
    var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
    if(typeof cantidad == "undefined"){
        cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
    }
    $(".boton-media").html(cantidad);
});
$.post( tickets['baja']['ruta'], function( data ) {
    var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
    if(typeof cantidad == "undefined"){
        cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
    }
    $(".boton-baja").html(cantidad);
});
$.post( tickets['muybaja']['ruta'], function( data ) {
    var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
    if(typeof cantidad == "undefined"){
        cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
    }
    $(".boton-muybaja").html(cantidad);
});
$.post( tickets['reabierto']['ruta'], function( data ) {
    var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
    if(typeof cantidad == "undefined"){
        cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
    }
    $(".boton-reabierto").html(cantidad);
});
$.post( tickets['confexterna']['ruta'], function( data ) {
    var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
    if(typeof cantidad == "undefined"){
        cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
    }
    $(".boton-confexterna").html(cantidad);
});
$.post( rutaReabiertosPropios, function( data ) {
    var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
    if(typeof cantidad != "undefined" && parseInt(cantidad) > 0){
        $(".num.reabiertos span").html(cantidad);
        cantidad = "<span class='reabierto'>⚠</span>";
        $(".boton-reabierto").html(cantidad);
        $(".reab .alerta").attr("class", "alertando");
    } else {
    	$(".num.reabiertos span").html("0");
    }
});
//
function crearSemaforo(){
    var botones = '<div id="contenedor-botones" class="contenedor-botones">';
    botones += '<a class="boton boton-todos" title="Ver bugs sin asignar ordenados por prioridad" href=\'/issues/?jql=project%20%3D%20ACC%20AND%20statusCategory%20in%20("To%20Do"%2C%20"In%20Progress")%20AND%20(assignee%20%3D%20EMPTY%20OR%20assignee%20%3D%20currentUser())%20AND%20type%20%3D%20Error%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC\'>Ver todos</a>';
    for(key in tickets){
        botones += '<a class="boton boton-'+key+'" title="'+tickets[key]['title']+'" href="'+tickets[key]['ruta']+'">?</a>';
    }
    botones += '</div>';

    var css = '.contenedor-botones {display:none;width: 240px;height: 40px;position: absolute;top: 20px;left: 65%;transform: translate(-50%, -50%);margin: auto;filter: url("#goo");animation: rotate-move 2s forwards;}span.reabierto{color:rgb(204, 20, 20);position:relative;top:-5px;font-size:27px}';
    css += '.boton { width: 30px;height: 30px;border-radius: 50%;background-color: #000;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;padding:0 !important; color: transparent;font-weight: bold;-webkit-font-smoothing: antialiased;font-family: Arial, sans-serif;font-size: 14px;text-align: center;overflow: hidden;white-space: pre;}';
    css += '.boton:hover {filter: brightness(120%);cursor: pointer;}';
    css += '.boton-todos {background-color: #3572b0;animation: boton-1-move 2s forwards;}';
    css += '.boton-todos:hover, .boton-todos:focus, .boton-todos:active {background-color: #3572b0 !important;}';
    css += '.boton-reabierto {background-color: rgb(165, 165, 165);animation: boton-10-move 2s forwards;}';
    css += '.boton-reabierto:hover, .boton-reabierto:focus, .boton-reabierto:active {background-color: rgb(165, 165, 165) !important;}';
    css += '.boton-confexterna {background-color: rgb(85, 85, 85);animation: boton-11-move 2s forwards;}';
    css += '.boton-confexterna:hover, .boton-confexterna:focus, .boton-confexterna:active {background-color: rgb(85, 85, 85) !important;}';
    css += '.boton-muybaja {background-color: rgb(85, 165, 87);animation: boton-2-move 2s forwards;}';
    css += '.boton-muybaja:hover, .boton-muybaja:focus, .boton-muybaja:active {background-color: rgb(85, 165, 87) !important;}';
    css += '.boton-baja {background-color: rgb(42, 135, 53);animation: boton-3-move 2s forwards;}';
    css += '.boton-baja:hover, .boton-baja:focus, .boton-baja:active {background-color: rgb(42, 135, 53) !important;}';
    css += '.boton-media {background-color: rgb(234, 125, 36);animation: boton-4-move 2s forwards;}';
    css += '.boton-media:hover, .boton-media:focus, .boton-media:active {background-color: rgb(234, 125, 36) !important;}';
    css += '.boton-alta {background-color: rgb(234, 68, 68);animation: boton-5-move 2s forwards;}';
    css += '.boton-alta:hover, .boton-alta:focus, .boton-alta:active {background-color: rgb(234, 68, 68) !important;}';
    css += '.boton-bloqueante {background-color: rgb(206, 0, 0);animation: boton-6-move 2s forwards;}';
    css += '.boton-bloqueante:hover, .boton-bloqueante:focus, .boton-bloqueante:active {background-color: rgb(206, 0, 0) !important;}';
    css += '.boton-revision {background-color: rgb(99, 0, 230);animation: boton-7-move 2s forwards;}';
    css += '.boton-revision:hover, .boton-bloqueante:focus, .boton-bloqueante:active {background-color: rgb(60, 0, 150) !important;}';
    css += '.boton-pruebas {background-color: rgb(200, 0, 200);animation: boton-8-move 2s forwards;}';
    css += '.boton-pruebas:hover, .boton-bloqueante:focus, .boton-bloqueante:active {background-color: rgb(160, 0, 160) !important;}';
    css += '.boton-pullrequest {background-color: rgb(200, 200, 0);animation: boton-9-move 2s forwards;}';
    css += '.boton-pullrequest:hover, .boton-bloqueante:focus, .boton-bloqueante:active {background-color: rgb(160, 160, 0) !important;}';
    css += '@keyframes boton-1-move {0% {} 5% {} 80% {transform: translate(40px, 0px);}93% {transform: translate(100px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}100% {transform: translate(100px, 0px); width: 66px; height: 14px; padding: 8px; color: white; border-radius:0; border-top-right-radius: 3px; border-bottom-right-radius: 3px;}}';
    css += '@keyframes boton-2-move {0% {} 5% {} 80% {transform: translate(20px, 0px);}93% {transform: translate(40px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}98% {transform: translate(40px, 0px); width: 32px; height: 22px; padding: 8px; color: white; border-radius:0;}100% {transform: translate(40px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}}';
    css += '@keyframes boton-3-move {0% {} 5% {} 80% {transform: translate(0px, 0px); }93% {transform: translate(0px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}96% {transform: translate(0px, 0px); width: 32px; height: 22px; padding: 8px; color: white; border-radius:0;}100% {transform: translate(0px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}98% {transform: translate(0px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}}';
    css += '@keyframes boton-4-move {0% {} 5% {} 80% {transform: translate(-20px, 0px);}93% {transform: translate(-40px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}94% {transform: translate(-40px, 0px); width: 32px; height: 22px; padding: 8px; color: white; border-radius:0;}96% {transform: translate(-40px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}100% {transform: translate(-40px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}}';
    css += '@keyframes boton-5-move {0% {} 5% {} 80% {transform: translate(-40px, 0px);}93% {transform: translate(-80px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}96% {transform: translate(-80px, 0px); width: 32px; height: 22px; padding: 8px; color: white; border-radius:0;}98% {transform: translate(-80px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}100% {transform: translate(-80px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}}';
    css += '@keyframes boton-6-move {0% {} 5% {} 80% {transform: translate(-60px, 0px);}93% {transform: translate(-120px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}98% {transform: translate(-120px, 0px); width: 32px; height: 22px; padding: 8px; color: white; border-radius:0; border-top-left-radius: 3px; border-bottom-left-radius: 3px;}100% {transform: translate(-120px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0; border-top-left-radius: 3px; border-bottom-left-radius: 3px;}}';
    css += '@keyframes boton-7-move {0% {} 5% {} 80% {transform: translate(-90px, 0px);}93% {transform: translate(-180px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}98% {transform: translate(-180px, 0px); width: 32px; height: 22px; padding: 8px; color: white; border-radius:0; border-top-left-radius: 3px; border-bottom-left-radius: 3px;}100% {transform: translate(-180px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0; border-top-right-radius: 3px; border-bottom-right-radius: 3px;}}';
    css += '@keyframes boton-8-move {0% {} 5% {} 80% {transform: translate(-110px, 0px);}93% {transform: translate(-220px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}98% {transform: translate(-220px, 0px); width: 32px; height: 22px; padding: 8px; color: white; border-radius:0; }100% {transform: translate(-220px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}}';
    css += '@keyframes boton-9-move {0% {} 5% {} 80% {transform: translate(-130px, 0px);}93% {transform: translate(-260px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}98% {transform: translate(-260px, 0px); width: 32px; height: 22px; padding: 8px; color: white; border-radius:0; border-top-left-radius: 3px; border-bottom-left-radius: 3px;}100% {transform: translate(-260px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0; border-top-left-radius: 3px; border-bottom-left-radius: 3px;}}';
    css += '@keyframes boton-10-move {0% {} 5% {} 80% {transform: translate(90px, 0px);}93% {transform: translate(180px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}98% {transform: translate(180px, 0px); width: 32px; height: 22px; padding: 8px; color: white; border-radius:0;}100% {transform: translate(180px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;border-top-left-radius: 3px; border-bottom-left-radius: 3px;}}';
    css += '@keyframes boton-11-move {0% {} 5% {} 80% {transform: translate(110px, 0px);}93% {transform: translate(220px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}98% {transform: translate(220px, 0px); width: 32px; height: 22px; padding: 8px; color: white; border-radius:0;}100% {transform: translate(220px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;border-top-right-radius: 3px; border-bottom-right-radius: 3px;}}';
    css += '@keyframes rotate-move {0% {filter: url("#goo")}40% {filter: url("#goo")}75% {filter: url("#goo2")}80% {filter: url("#goo3")}90% {filter: url("#goo4")}93% {filter: url("#goo5")}98% {filter: none}100% {filter: none}}';

    var svg = '<svg style="display:none" class="filtros-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" version="1.1"><defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"/></filter><filter id="goo2"><feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7"/></filter><filter id="goo3"><feGaussianBlur in="SourceGraphic" stdDeviation="7.5" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"/></filter><filter id="goo4"><feGaussianBlur in="SourceGraphic" stdDeviation="6.5" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"/></filter><filter id="goo5"><feGaussianBlur in="SourceGraphic" stdDeviation="6.4" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 40 -7"/></filter></defs></svg>';

    $("#header nav .aui-header-primary ul").append(svg);
    $("#header nav .aui-header-primary ul").first().append(botones);
    var style = document.createElement('style');
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
}

function crearDashboard(){
    var storage = window.localStorage;
    var mostrarBugs = storage.getItem('mostrarBugs') != 'false', mostrarReab = storage.getItem('mostrarReab') != 'false', mostrarProp = storage.getItem('mostrarProp') != 'false', mostrarRev = storage.getItem('mostrarRev') != 'false',mostrarPruebas = storage.getItem('mostrarPruebas') != 'false', mostrarPull = storage.getItem('mostrarPull') != 'false';

    var ancho = 33;

    var botones = '<div class="contenedor-dash">';
    botones += '<div id="abrir" title="Mostrar semáforo"><svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="traffic-light" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 1024" class="svg-inline--fa fa-traffic-light fa-w-12 fa-2x"><g class="fa-group"><path fill="#ccc" d="M192 320a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0-160a48 48 0 1 0-48-48 48 48 0 0 0 48 48zm0 32a48 48 0 1 0 48 48 48 48 0 0 0-48-48z" class="fa-secondary"></path><path fill="#555" d="M384 192h-64v-37.88c37.2-13.22 64-48.38 64-90.12h-64V32a32 32 0 0 0-32-32H96a32 32 0 0 0-32 32v32H0c0 41.74 26.8 76.9 64 90.12V192H0c0 41.74 26.8 76.9 64 90.12V320H0c0 42.79 28.19 78.61 66.86 91v-.15a128 128 0 0 0 250.34 0v.15c38.61-12.4 66.8-48.22 66.8-91h-64v-37.88c37.2-13.22 64-48.38 64-90.12zM192 416a48 48 0 1 1 48-48 48 48 0 0 1-48 48zm0-128a48 48 0 1 1 48-48 48 48 0 0 1-48 48zm0-128a48 48 0 1 1 48-48 48 48 0 0 1-48 48z" class="fa-primary"></path></g></svg></div>';
    botones += '<div class="contenedor-dashboard">';
    if(mostrarBugs){
       ancho += 35;
       botones += '<div class="contenedor bugs" title="Bugs bloqueantes">'+SVG_BUGS+'</div><div class="num bugs"><span>?</span></div>';
    }
    if(mostrarProp){
        ancho += 35;
        botones += '<div class="contenedor propios" title="Tickets propios en progreso">'+SVG_PROP+'</div><div class="num propios"><span>?</span></div>';
    }
    if(mostrarReab){
        ancho += 35;
        botones += '<div class="contenedor reabiertos" title="Tickets propios reabiertos">'+SVG_REAB+'</div><div class="num reabiertos"><span>?</span></div>';
    }
    if(mostrarRev){
        ancho += 35;
        botones += '<div class="contenedor rev" title="Tickets en revisión">'+SVG_REV+'</div><div class="num rev"><span>?</span></div>';
    }
    if(mostrarPruebas){
        ancho += 35;
        botones += '<div class="contenedor pruebas" title="Tickets en pruebas">'+SVG_PRUE+'</div><div class="num pruebas"><span>?</span></div>';
    }
    if(mostrarPull){
        ancho += 35;
        botones += '<div class="contenedor pull" title="Tickets en pull request">'+SVG_PULL+'</div><div class="num pull"><span>?</span></div>';
    }
    botones += '<div id="opciones" title="Opciones"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cog" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-cog fa-w-16 fa-2x"><path fill="#555" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z" class=""></path></svg></div>';
    botones += '</div>';
    botones += '</div>';

    botones += '<div id="myModal" class="modal"><div class="modal-content"><span class="close">&times;</span>';
    botones += '<h2>Configuración jira dashboard:</h2><br>';
    botones += '<label id="labelBugs"> <input id="checkBugs" type="checkbox"'+(mostrarBugs?' checked':'')+'>Mostrar alertas de bugs bloqueantes</label><br>';
    botones += '<label id="labelProp"> <input id="checkProp" type="checkbox"'+(mostrarProp?' checked':'')+'>Mostrar alertas de tickets propios en progreso</label><br>';
    botones += '<label id="labelReab"> <input id="checkReab" type="checkbox"'+(mostrarReab?' checked':'')+'>Mostrar alertas de tickets propios reabiertos</label><br>';
    botones += '<label id="labelRev"> <input id="checkRev" type="checkbox"'+(mostrarRev?' checked':'')+'>Mostrar alertas de tickets en revisión</label><br>';
    botones += '<label id="labelPruebas"> <input id="checkPruebas" type="checkbox"'+(mostrarPruebas?' checked':'')+'>Mostrar alertas de tickets en pruebas</label><br>';
    botones += '<label id="labelPull"> <input id="checkPull" type="checkbox"'+(mostrarPull?' checked':'')+'>Mostrar alertas de tickets en pull-request</label><br>';
    botones += '</div></div>';


    var css = '.contenedor-dash {width: '+(ancho+32)+'px;height: 30px;position: absolute;top: 41px;right: 15px;}';
    css += '#abrir {width: 30px;height: 28px;position: absolute;top: 0;left: 0;background:#f5f5f5;border:1px solid #ccc;border-bottom-left-radius: 3px;cursor:pointer;border-top:none}';
    css += '#abrir svg {position: relative;top:4px;left:7px}';
    css += '.contenedor-dashboard {width: '+ancho+'px;height: 28px;position: absolute;top: 0;left: 32px;background:#f5f5f5;border:1px solid #ccc;border-left: none;border-top:none;border-right:none}';
    css += '.contenedor {width:20px;height:28px;display:inline-block; margin:4px 6px}';
    css += '#opciones {width:15px;height:15px;display:inline-block; margin:4px 6px; float:right;cursor:pointer}';
    css += '.alertando{animation: alerta .5s forwards}';
    css += '@keyframes alerta {from {fill: #555;}to {fill: #dc3545;}}';
    css += '.num {position: absolute;height: 8px;background: #fafafa;padding: 0;margin: 0;top: 29px;text-align: center;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;border: 1px solid #eee;border-top:none}';
    css += '.num span {color: #777;font-size: 8px;top: -8px;position: relative;}';
    css += '.num.bugs{left: -1px;width: 31px;}';
    css += '.num.propios{left: 31px;width:30px}';
    css += '.num.reabiertos{left: 62px;width:32px}';
    css += '.num.rev{left: 94px;width:32px}';
    css += '.num.pruebas{left: 126px;width:32px}';
    css += '.num.pull{left: 158px;width:32px}';

    css += '/* The Modal (background) */.modal {  display: none; /* Hidden by default */  position: fixed; /* Stay in place */  z-index: 1; /* Sit on top */  left: 0;  top: 0;  width: 100%; /* Full width */  height: 100%; /* Full height */  overflow: auto; /* Enable scroll if needed */  background-color: rgb(0,0,0); /* Fallback color */  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */}/* Modal Content/Box */.modal-content {  background-color: #fefefe;  margin: 15% auto; /* 15% from the top and centered */  padding: 20px;  border: 1px solid #888;  width: 80%; /* Could be more or less, depending on screen size */}/* The Close Button */.close {  color: #aaa;  float: right;  font-size: 28px;  font-weight: bold;}.close:hover,.close:focus {color: black;text-decoration: none;cursor: pointer;}';

    $("body").append(botones);
    var style = document.createElement('style');
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
    //modal
    var modal = document.getElementById("myModal");
    var btn = document.getElementById("opciones");
    var span = document.getElementsByClassName("close")[0];
    btn.onclick = function() {
        modal.style.display = "block";
    }
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    //
    document.getElementById("labelBugs").onclick = function(){
        var checkBox = document.getElementById("checkBugs");
        if (checkBox.checked == true){
            storage.setItem('mostrarBugs', 'true');
        } else {
            storage.setItem('mostrarBugs', 'false');
        }
    };
    document.getElementById("labelProp").onclick = function(){
        var checkBox = document.getElementById("checkProp");
        if (checkBox.checked == true){
            storage.setItem('mostrarProp', 'true');
        } else {
            storage.setItem('mostrarProp', 'false');
        }
    };
    document.getElementById("labelReab").onclick = function(){
        var checkBox = document.getElementById("checkReab");
        if (checkBox.checked == true){
            storage.setItem('mostrarReab', 'true');
        } else {
            storage.setItem('mostrarReab', 'false');
        }
    };
    document.getElementById("labelRev").onclick = function(){
        var checkBox = document.getElementById("checkRev");
        if (checkBox.checked == true){
            storage.setItem('mostrarRev', 'true');
        } else {
            storage.setItem('mostrarRev', 'false');
        }
    };
    document.getElementById("labelPruebas").onclick = function(){
        var checkBox = document.getElementById("checkPruebas");
        if (checkBox.checked == true){
            storage.setItem('mostrarPruebas', 'true');
        } else {
            storage.setItem('mostrarPruebas', 'false');
        }
    };
    document.getElementById("labelPull").onclick = function(){
        var checkBox = document.getElementById("checkPull");
        if (checkBox.checked == true){
            storage.setItem('mostrarPull', 'true');
        } else {
            storage.setItem('mostrarPull', 'false');
        }
    };
    //
    document.getElementById("abrir").onclick = function(){
        document.getElementById("contenedor-botones").style.display = "block";
    };
}

function getUser(){
    return $("#header-details-user-fullname").data("username");
}

function falificar(){
    var usuarios = {
        "manuel.anton" : {
            "id" : "10704",
            "img" : "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4KCjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0iYnVsbCIKICAgeD0iMHB4IgogICB5PSIwcHgiCiAgIHZpZXdCb3g9IjAgMCAyNCAyNCIKICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjQgMjQiCiAgIHhtbDpzcGFjZT0icHJlc2VydmUiCiAgIGlua3NjYXBlOnZlcnNpb249IjAuNDguNSByMTAwNDAiCiAgIHdpZHRoPSIxMDAlIgogICBoZWlnaHQ9IjEwMCUiCiAgIHNvZGlwb2RpOmRvY25hbWU9InVzZXJhdmF0YXJfbWFudWVsLnN2ZyI+PG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMzIiPjxyZGY6UkRGPjxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+PGRjOnRpdGxlIC8+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxkZWZzCiAgICAgaWQ9ImRlZnMzMCIgLz48c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCIKICAgICBncmlkdG9sZXJhbmNlPSIxMCIKICAgICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjEyMzciCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iODcwIgogICAgIGlkPSJuYW1lZHZpZXcyOCIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMjcuODEyODY2IgogICAgIGlua3NjYXBlOmN4PSIyLjI4NzgzMzQiCiAgICAgaW5rc2NhcGU6Y3k9IjYuOTU2MTI2MiIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMzkwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSIxMzEiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJidWxsIiAvPjxnCiAgICAgaWQ9ImNvbG9yX3g1Rl9iZyIKICAgICBzdHlsZT0iZmlsbDojY2NjY2NjIj48cGF0aAogICAgICAgZmlsbD0iIzUxQzNDNCIKICAgICAgIGQ9Ik0xMiwyNEwxMiwyNEM1LjQsMjQsMCwxOC42LDAsMTJsMCwwQzAsNS40LDUuNCwwLDEyLDBsMCwwYzYuNiwwLDEyLDUuNCwxMiwxMmwwLDBDMjQsMTguNiwxOC42LDI0LDEyLDI0eiIKICAgICAgIGlkPSJwYXRoNCIKICAgICAgIHN0eWxlPSJmaWxsOiNjY2NjY2MiIC8+PC9nPjxnCiAgICAgaWQ9IkxheWVyXzIiIC8+PHBhdGgKICAgICBzdHlsZT0iZmlsbDojMDAwMDAwIgogICAgIGQ9Ik0gNi42MDQzMTc0LDIxLjE0ODU0NSBDIDYuMDY1ODI4NCwyMC45MDE4NzggNS40OTE0NDExLDIwLjMyNzk2MSA1LjI1MjkyNjYsMTkuNzk4MjYzIDUuMTU2MjQyMiwxOS41ODM1NDkgNS4wOTA0NDQsMTkuMTgwMTkgNS4wODU5NDMyLDE4Ljc3NDY0MiA1LjA3OTYwMzIsMTguMjA4MzYgNS4xMjI0MzgyLDE4LjAyMTA1NiA1LjM2MzkzNiwxNy41NTc1NDEgNi4zODMzNTU4LDE1LjYwMDkxMyA5LjIyNTUwMjEsMTUuNjc0OTU1IDEwLjE2NzAzLDE3LjY4MjY2NiBsIDAuMjMxMjY2LDAuNDkzMTUxIDIuMDgzNTI3LDAuMDU3MDEgMC43NDU1NDIsMCAwLjE1NTc3NywtMC40MDAzODQgYyAwLjYzOTQ4NCwtMS42NDM2MjUgMi44ODYxODgsLTIuMTk4MzI1IDQuMjUyODkxLC0xLjA1MDAwOCAxLjIwOTYxNywxLjAxNjMyOSAxLjIzMjE1NiwyLjk2MDM2NSAwLjA0NjIxLDMuOTg1MDY3IC0xLjQwODQsMS4yMTY5MDYgLTMuNjkxMDk0LDAuNjYxNzczIC00LjMwOTc3NiwtMS4wNDgxMDQgLTAuMTQ1MDgzLC0wLjQwMDk3MSAtMC4xOTUzNjgsLTAuNDQ5NDM4IC0wLjUyMjU5LC0wLjUwMzcwNSAtMC4xOTkxMzQsLTAuMDMzMDIgLTEuNDY3NDc3LDAuMDE3ODMgLTEuNjY2NjEyLDAuMDUwODUgLTAuMzMwOTY4LDAuMDU0ODkgLTAuNzcyMjExLC0wLjAwNzMgLTAuOTI4MTQ0LDAuNDIzNjI3IC0wLjM3NjE1OTIsMS4wMzk2MDYgLTEuMzI3Nzk5MSwxLjY3NzU0NyAtMi41MDI0NjE4LDEuNjc3NTQ3IC0wLjUwMTI1NTYsMCAtMC43OTAyOTg2LC0wLjA1NTE2IC0xLjE0ODM0MTgsLTAuMjE5MTc2IHogbSAyLjEwMDY5NzksLTAuOTgwMzAxIGMgMC41MTk4Nzg0LC0wLjM1MzY0MSAwLjc2MzMxMzQsLTAuNzk0MzQgMC43NjMzMTM0LC0xLjM4MTg1OSAwLC0wLjU2OTQyNCAtMC4yMjAyNDEsLTAuOTgzNzUxIC0wLjc0MzY4MzEsLTEuMzk5MDQ1IC0wLjMyMzM1NjYsLTAuMjU2NTQ3IC0wLjQzOTY5NTQsLTAuMjkxNzU5IC0wLjk2Mzk2LC0wLjI5MTc1OSAtMC40NzMxMTk1LDAgLTAuNjY1NzEwMSwwLjA0Njc0IC0wLjkzMjc3MjYsMC4yMjYzNjMgLTAuNzI4MTM0MiwwLjQ4OTc0MyAtMS4wMDMzNzU2LDEuMjY2Njc5IC0wLjcxMzA3NTQsMi4wMTI4MjcgMC40MjAzOTYyLDEuMDgwNTMzIDEuNjQ2ODI1LDEuNDc1MTc1IDIuNTkwMTc3NywwLjgzMzQ3MyB6IG0gNy45OTcwNzM3LDAuMTI5MjY0IGMgMC44ODI5NjEsLTAuNDQyMTYyIDEuMTkxNzIzLC0xLjYwNjcyOSAwLjY0MjEyOCwtMi40MjE5MzYgLTAuOTY0ODExLC0xLjQzMTA5MyAtMy4xODg3MjMsLTAuNzQ5NjE0IC0zLjE3NTg2OSwwLjk3MzE4OCAwLjAwOTIsMS4yMzgyNTYgMS4zODQxNzMsMi4wMjQ0MTggMi41MzM3NDEsMS40NDg3NDggeiBNIDYuMDUwMDIwNiwxNi4xOTQyMjkgYyAwLC0wLjIzMTg1OCAtMC4zODg0MDEzLC0wLjYxOTAwMiAxLjIzODczMzYsLTEuMDA4Njk1IDEuNDgxMjU4MSwtMC4zNTQ3NTYgMi44NzI0MzU4LC0wLjI4MDY0MyA0Ljc1NjMyMDgsLTAuMjgwNjQzIDEuODgzODgzLDAgMy40NTMwMjcsMC4wNzg0MyA0LjkzNDI4NCwwLjQzMzE4NSAxLjY5NzAyNSwwLjQwNjQzMiAwLjkxODkwMSwwLjY3NjU5IDAuNzkxNDc1LDAuODc4OTc3IEMgMTYuNzc2NjksMTUuOTg2NDE2IDcuNDMxMTg3NiwxNS40NTUxMjUgNi4wNTAwMjA2LDE2LjE5NDE4OSB6IE0gOC40ODUzODczLDE0LjM3NDYwNCBDIDguNjQ3MzY0LDE0LjI5OTUzOCA5LjgwNDg4MzQsNC42OTA5MTg3IDkuMjA1MDU0LDMuOTUwMDE2NSA4LjU2MTc1NjgsMy4xNTU0MjMzIDEwLjE1MjkxOSwwLjQ0MDAxMTg5IDExLjE2NTA5NSwyLjE5ODkzOTYgTCAxMS43MjAzLDMuMTYzNzU3NyAxMi4yNDgxMjgsMi4wNDk0ODE1IGMgMC43NDY4MDgsLTEuNTc2NTU2OTggMi4xMzU2NzgsMC45MzIwMTkgMS42NzkzODgsMS40Njg0MTQzIC0wLjEzODY5MSwzLjc0OTU1MTQgMC4xNTk2NjksNy4xNTU0NTgyIDAuODQ0MTI1LDExLjA3NjU1NTIgMC4xMDc3NSwwLjEyOTY3MiAyLjY4MjA2OCwtMC4wNDIyNyAtMi40ODEwNDksMC4wMjI0MyAtNC4wNTcyMTg4LDAuMDUwODUgLTMuOTc3ODg4OSwtMC4xNjIyNDkgLTMuODA1MjA0NywtMC4yNDIyNzcgeiIKICAgICBpZD0icGF0aDM3ODgiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNzY3NzY2Njc3Nzc2Njc3Njc3Nzc3Nzc3NzY3Njc3NzY2Njc3NzY3NjY3NzIiAvPjwvc3ZnPg=="
        },
        "alejandro" : {
            "id":"10336",
            "img" : "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4KCjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0iYnVsbCIKICAgeD0iMHB4IgogICB5PSIwcHgiCiAgIHZpZXdCb3g9IjAgMCAyNCAyNCIKICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjQgMjQiCiAgIHhtbDpzcGFjZT0icHJlc2VydmUiCiAgIGlua3NjYXBlOnZlcnNpb249IjAuNDguNSByMTAwNDAiCiAgIHdpZHRoPSIxMDAlIgogICBoZWlnaHQ9IjEwMCUiCiAgIHNvZGlwb2RpOmRvY25hbWU9InVzZXJhdmF0YXJfYWxlamFuZHJvLnN2ZyI+PG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMzIiPjxyZGY6UkRGPjxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+PGRjOnRpdGxlIC8+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxkZWZzCiAgICAgaWQ9ImRlZnMzMCIgLz48c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCIKICAgICBncmlkdG9sZXJhbmNlPSIxMCIKICAgICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjEyMzciCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iODcwIgogICAgIGlkPSJuYW1lZHZpZXcyOCIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMjcuODEyODY2IgogICAgIGlua3NjYXBlOmN4PSIxMy45MTg1MjYiCiAgICAgaW5rc2NhcGU6Y3k9IjEyLjA1OTkyNCIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImJ1bGwiIC8+PGcKICAgICBpZD0iY29sb3JfeDVGX2JnIj48cGF0aAogICAgICAgZmlsbD0iIzUxQzNDNCIKICAgICAgIGQ9Ik0xMiwyNEwxMiwyNEM1LjQsMjQsMCwxOC42LDAsMTJsMCwwQzAsNS40LDUuNCwwLDEyLDBsMCwwYzYuNiwwLDEyLDUuNCwxMiwxMmwwLDBDMjQsMTguNiwxOC42LDI0LDEyLDI0eiIKICAgICAgIGlkPSJwYXRoNCIgLz48L2c+PGNpcmNsZQogICAgIGN4PSIxMS45IgogICAgIGN5PSIxNy42IgogICAgIHI9IjMiCiAgICAgaWQ9ImNpcmNsZTkiCiAgICAgc29kaXBvZGk6Y3g9IjExLjkiCiAgICAgc29kaXBvZGk6Y3k9IjE3LjYiCiAgICAgc29kaXBvZGk6cng9IjMiCiAgICAgc29kaXBvZGk6cnk9IjMiCiAgICAgc3R5bGU9ImZpbGw6I2ZlYmQxYiIKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC4wMTE4MDg0NiwwLjAyNTY3MzE3KSIgLz48cGF0aAogICAgIGQ9Ik0gNC4zNDg3Mjk3LDE3LjM1NjQ1OSBDIDQuNTM0NDY5LDE1LjA0NjM4OSA3LjI5Nzg2MzksMTQuNzQ4NTk0IDguNjk3ODcxLDE0LjA3Mjg0NyA5LjI0MjEyMjcsMTEuOTQ0NjYyIDkuNTM3OTM0NCwzLjIwMTM3ODggMTAuMTc2NDc0LDMuMTg2OTQ4NiBsIDMuNDYyNTc0LC0wLjA3ODI1IGMgMC43MjExMTYsLTAuMDE2Mjk1IDEuMTQxMTg0LDguODMzMDExNCAxLjc3NDkzNiwxMC45NDA2ODY0IDEuNDY0ODE3LDAuODA3NTk5IDMuMzI3MTg1LDEuMTcwMDY1IDQuMTMwNzE1LDIuOTg4NDgyIDAuNzQ1OTY0LDIuODA5ODQ4IC0xLjY2ODI2NSw0LjUyMDA5OSAtMi45ODQ3NCw0LjQ5MzA3NyAtNC4yNDc5ODksLTAuMDg3MTkgLTMuMzMzMzM5LC0xLjYzMTAyOCAtNC41NjgwODksLTEuNjE3MTExIC0xLjIzNDc0OSwwLjAxMzkyIC0wLjE5NjQ4NCwxLjQwNTgxMSAtNC41OTI3NDkzLDEuNjg5MDIxIC0xLjYyOTEyNywwLjEwNDk0OSAtMy41MjAyMTcsLTEuNzcyMjY1IC0zLjA1MDM5MSwtNC4yNDYzOTUgeiIKICAgICBpZD0icGF0aDE1IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgc3R5bGU9ImZpbGw6I2ZlYmQxYiIKICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjc3NjY3Nzc2MiIC8+PGNpcmNsZQogICAgIGN4PSIxMS45IgogICAgIGN5PSIxNy40IgogICAgIHI9IjEuNyIKICAgICBpZD0iY2lyY2xlMTkiCiAgICAgc29kaXBvZGk6Y3g9IjExLjkiCiAgICAgc29kaXBvZGk6Y3k9IjE3LjQiCiAgICAgc29kaXBvZGk6cng9IjEuNyIKICAgICBzb2RpcG9kaTpyeT0iMS43IgogICAgIHN0eWxlPSJmaWxsOiMyYjUxODQiCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuMDMyODcwMTcsMC44MzMwNjM3MykiIC8+PHBhdGgKICAgICBkPSJtIDEyLjM4MzA1MSw5LjQ1OTc0MTEgLTAuMDkwNDIsLTMuOTIxNjQyMyBjIDAsLTAuNTkyNjMzNyAxLjUxMzUzNCwtMC4wMjQwMTYgMi4wMTM1MzQsLTAuNzM1MTc2NSAwLjQsLTAuNTkyNjMzOCAtMC4yNzEzMiwtMS40NzEwNzQyIC0wLjYxNzk3OCwtMi4wNTE1MjYzIEMgMTIuNzQwMzUxLDEuMTY0MzEyMSAxMS40OTQ1MjUsMC44MjgyMjMxNSAxMC4yMDg0MTksMi43NjkzNzMzIDkuODM3ODQ3NiwzLjMyODY4NTIgOS4yMjYzOTU5LDQuMjI4MjY1OCA5LjYyNjM5NTksNC44MjA4OTk2IDEwLjAyNjM5Niw1LjUzMjA2MDEgMTEuNDE3Mjg0LDQuOTI3NDg3OCAxMS40MTcyODQsNS41MjAxMjE1IGwgLTAuMDA1NCwzLjkzOTYxOTYgQyAxMS40ODg1MzQsMTIuNzc2NjgyIDEwLjAwMDYzLDE0LjQzMDQyMSA4LjMwNTA4NDgsMTcuNzA0NzExIDcuODU4MTQ4MiwxOC44OTYwMzYgOC44LDIwLjI3ODYzNiA5LjgsMjAuMzk3MTYzIGMgMC44LDAuMTE4NTI3IDEuNCwtMC4zNTU1ODEgMS44LC0xLjA2Njc0MSAwLjEsLTAuMjM3MDU0IDAuNSwtMC4yMzcwNTQgMC42LDAgMC40LDAuNzExMTYgMS4xLDEuMTg1MjY4IDEuOCwxLjA2Njc0MSAxLC0wLjExODUyNyAxLjc1Mjc2NiwtMS41NTk3MDYgMS4zOTMyMiwtMi43MTk2ODIgLTEuNTc0MjQ1LC0zLjQ4MDU1MSAtMy4wOTc2OSwtNC45ODcyNDUgLTMuMDEwMTY5LC04LjIxNzczOTkgeiIKICAgICBpZD0icGF0aDIzIgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZiIKICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY3NzY2NjY2NjY2NjYyIgLz48cGF0aAogICAgIGQ9Im0gMTIuOTI1NCwxOC40OTQxNTQgLTAuNzEyMzY0LDAuMzMxMTcgYyAtMC4yMTM3MDksMC4wNjYyMyAtMC40Mjc0MTgsMC4wNjYyMyAtMC42NDExMjcsMCBsIC0wLjcxMjM2MywtMC4zMzExNyBjIC0wLjIxMzcwOSwtMC4xMzI0NjggLTAuMzU2MTgyLC0wLjMzMTE2OSAtMC4zNTYxODIsLTAuNTk2MTA1IHYgLTAuMjY0OTM2IGMgMCwtMC4zMzExNjkgMC4zNTYxODIsLTAuNjYyMzQgMC43MTIzNjMsLTAuNjYyMzQgaCAxLjQyNDcyNyBjIDAuMzU2MTgyLDAgMC43MTIzNjQsMC4yNjQ5MzYgMC43MTIzNjQsMC42NjIzNCB2IDAuMjY0OTM2IGMgMCwwLjI2NDkzNiAtMC4xNDI0NzMsMC40NjM2MzcgLTAuNDI3NDE4LDAuNTk2MTA1IHoiCiAgICAgaWQ9InBhdGgyNSIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgIHN0eWxlPSJmaWxsOiMyYjUxODQiIC8+PGcKICAgICBpZD0iTGF5ZXJfMiIgLz48cGF0aAogICAgIHN0eWxlPSJmaWxsOiMyYjUxODQ7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiMyYjUxODQ7c3Ryb2tlLXdpZHRoOjAuMTtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1vcGFjaXR5OjE7c3Ryb2tlLWRhc2hhcnJheTpub25lIgogICAgIGQ9Im0gMTEuOTc0NTc3LDEuNDQ5MTUyNSBjIC0wLjA0ODE5LDAuMTg5MjIyOCAtMC4yOTE4ODgsMS4wNzQwOTUzIC0wLjQ2MzYwOCwxLjIzMjQzNDcgbCAwLjkzNjg5NiwwLjAwMTk1IEMgMTIuMjc0Njc0LDIuNDc0Nzc0OSAxMS45ODA0MjEsMS42MjQ0NDQ0IDExLjk3NDU3NywxLjQ0OTE1MjUgeiIKICAgICBpZD0icGF0aDM3OTgiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2MiIC8+PC9zdmc+"
        },
        "c.campo" : {
            "id":"10703",
            "img":"data:image/gif;base64,R0lGODlhGAAYAOflAO8TEs03HMc6Gc44HbtFHrtMIKxSI6FZIpljI5hoJpBrJZVrLZBxMH58KpF4NHeBLXOELWuIL3CHL2aKMHGIMGeLMZJ+OWSOKmOPMmmOM2GSLVWWLn2JOmWRNFyVL4yFQlaXL4iHPHWNPGOUL3KPNoOJQ1eYMImIPVGaMUWfLFKbMl+YMm6TOE6eLF6YOVOcM0yfNFSdNEWiNkiiLk2gNXWUQFChLkmjL06hNmGbPF2dNkqkME+iN0ikOEOnMoqQSUmlOTqqNKaHUWOdPjStLkSoM3iXQ12gPzGuNymxMTyrNZmNUW6bRUWpNGqdP1OlOjOvOCuyMjevMDSwOTiwMXacR0CuOHGeSDmxMnybR0asP3edSFaoPS61NEGvOUetQGijQ4GbTzC2NXydT0iuQXmfSlGsQDG3Nn2eUFKtQVerRzq1PXuhTEWzPHClTK+RYIChU2uoTlmuSYGiVGirSUi2Pz+5QVayRVuwS26rUVWzTUK7Q8eQbUm5SqacZVi2UMSUbm2yVl+2WIirYnmxXrehc7SjdMyeg7qlfYC6bXu9btGjiGbHZbusgY67dsSqiZ63fcqpiq2zg5y8gNuolKy5h9Otla26iLi3iNqtl5rChK+8irm6kbHAlNq0nOazpabJkqPOlbvKndDFpc7Fq9XFrfy4vOTBtd/DtOrAtvq9vtXNstrMutvNu+bKu/DIw93PvePOvf7Hx9/Sv/rLyOLUwfbOyebTyOHWycThvu7Uy+/VzOnXzP/R1ObbzvnX0O7b0Ozc1/bf3NTs0Pjg3fPj3vXl4Ofu4/np4/rq5Pjr7Pvr5v/t7/fx8Prx6v3w8O/26/7x8fjz8fb17Pzy+fn08v/z9Pr18/z29f339v749/j69//5+Pn7+P/6+fr8+fv9+v/8+v/9+/z/+/7//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEKAP8ALAAAAAAYABgAAAj+AMkJHDiQWy9VvbJxI8iwocBowDwt8qQrmsOLAm0BgkOnDB9aGB0S+xSiR5QUJzIxC0mQ2683NIhEIbLDjyyWA429EqEESxQoVIykkoaTHDdtq1b4iNIjhaRdC3FyU1bKwQQoERpUChYV560tBA6oQCCgBK6uDrVFhfVhgIALBgAI8cWtbjaH1wbOspCgQAUFA5bw4vZMm8WG2ga24uCCgQcMC2rE0pYXmUNsep0A6ZDiSYYnrq59I1fNYWmBte7Q8EHFBw41qJJ1I5e4YbJv4LjN6oMCyxkfPrSUIraNXLPLC7lhWmNCypkWwUfdwp23ITWB37JgARHDi4YXeziOtXKW22FUaGmwbKDw5IGHPZBIEUXb8BiXKC0kjICgQlEnViyJMgkhY+zhxRAk5GCGII0ccsppDU0TBxQpMBGGIHpUocYXc7DhBhqWHMaQJmQkQYQSOuQBxhVWKMFCCn/QYEgxF9XxkxRH9PDCD4hsMgURSTwBSm0NDcMIHoE4MsgjlBRiSiSXJBJKLgwFBAA7"
        },
        "carlos.martin" : {
            "id":""
        }
    };
    if(typeof usuarios[getUser()] != "undefined"){
       $.each(usuarios, function(username, userdata){
           if(typeof userdata['img'] != "undefined"){
              $("img[src*='avatarId="+userdata['id']+"']").attr("src", userdata['img']);
           }
       });
    }
}