// ==UserScript==
// @name         Jira bug semaphore
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Displays bugs count by colors according to priority
// @author       Manantt
// @match        http://intranet.jira.es/*
// @grant        none
// ==/UserScript==

var tickets = {
    "bloqueante" : {
        "cantidad" : 0,
        "title":"Bloqueantes",
        "color" : "rgb(206, 0, 0)",
        "borde" : "rgb(133, 0, 0)",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20in%20(NET%2C%20NeT10-Bugs)%20AND%20priority%20in%20(Bloqueante)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC'
    },
    "alta" : {
        "cantidad" : 0,
        "title":"Prioridad alta",
        "color" : "rgb(234, 68, 68)",
        "borde" : "rgb(176, 19, 19)",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20in%20(NET%2C%20NeT10-Bugs)%20AND%20priority%20in%20(Alta)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC'
    },
    "media" : {
        "cantidad" : 0,
        "title":"Prioridad media",
        "color" : "rgb(234, 125, 36)",
        "borde" : "rgb(160, 80, 15)",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20in%20(NET%2C%20NeT10-Bugs)%20AND%20priority%20in%20(Media)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC'
    },
    "baja" : {
        "cantidad" : 0,
        "title":"Prioridad baja",
        "color" : "rgb(42, 135, 53)",
        "borde" : "rgb(27, 87, 34)",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20in%20(NET%2C%20NeT10-Bugs)%20AND%20priority%20in%20(Baja)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC'
    },
    "muybaja" : {
        "cantidad" : 0,
        "title":"Prioridad muy baja",
        "color" : "rgb(85, 165, 87)",
        "borde" : "rgb(55, 107, 56)",
        "ruta" : "http://intranet.jira.es/issues/?jql=project%20in%20(NET%2C%20NeT10-Bugs)%20AND%20priority%20in%20(\'Muy%20baja\')%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC"
    },
};
(function() {
    crearSemaforo();
})();

$.post( tickets['bloqueante']['ruta'], function( data ) {
    var cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
    $(".boton-bloqueante").html(cantidad);
});
$.post( tickets['alta']['ruta'], function( data ) {
    var cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
    $(".boton-alta").html(cantidad);
});
$.post( tickets['media']['ruta'], function( data ) {
    var cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
    $(".boton-media").html(cantidad);
});
$.post( tickets['baja']['ruta'], function( data ) {
    var cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
    $(".boton-baja").html(cantidad);
});
$.post( tickets['muybaja']['ruta'], function( data ) {
    var cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
    $(".boton-muybaja").html(cantidad);
});
//
function crearSemaforo(){
    var botones = '<div class="contenedor-botones">';
    botones += '<a class="boton boton-todos" title="Ver bugs sin asignar ordenados por prioridad" href=\'/issues/?jql=project%20%3D%20ACC%20AND%20statusCategory%20in%20("To%20Do"%2C%20"In%20Progress")%20AND%20(assignee%20%3D%20EMPTY%20OR%20assignee%20%3D%20currentUser())%20AND%20type%20%3D%20Error%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC\'>Ver todos</a>';
    for(key in tickets){
        botones += '<a class="boton boton-'+key+'" title="'+tickets[key]['title']+'" href="'+tickets[key]['ruta']+'">?</a>';
    }
    botones += '</div>';

    var css = '.contenedor-botones {width: 240px;height: 40px;position: absolute;top: 20px;left: 60%;transform: translate(-50%, -50%);margin: auto;filter: url("#goo");animation: rotate-move 2.5s forwards;}';
    css += '.boton { width: 30px;height: 30px;border-radius: 50%;background-color: #000;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;padding:0 !important; color: transparent;font-weight: bold;-webkit-font-smoothing: antialiased;font-family: Arial, sans-serif;font-size: 14px;text-align: center;overflow: hidden;white-space: pre;}';
    css += '.boton:hover {filter: brightness(120%);cursor: pointer;}';
    css += '.boton-todos {background-color: #3572b0;animation: boton-1-move 2.5s forwards;}';
    css += '.boton-todos:hover, .boton-1:focus, .boton-1:active {background-color: #3572b0 !important;}';
    css += '.boton-muybaja {background-color: rgb(85, 165, 87);animation: boton-2-move 2.5s forwards;}';
    css += '.boton-muybaja:hover, .boton-muybaja:focus, .boton-muybaja:active {background-color: rgb(85, 165, 87) !important;}';
    css += '.boton-baja {background-color: rgb(42, 135, 53);animation: boton-3-move 2.5s forwards;}';
    css += '.boton-baja:hover, .boton-baja:focus, .boton-baja:active {background-color: rgb(42, 135, 53) !important;}';
    css += '.boton-media {background-color: rgb(234, 125, 36);animation: boton-4-move 2.5s forwards;}';
    css += '.boton-media:hover, .boton-media:focus, .boton-media:active {background-color: rgb(234, 125, 36) !important;}';
    css += '.boton-alta {background-color: rgb(234, 68, 68);animation: boton-5-move 2.5s forwards;}';
    css += '.boton-alta:hover, .boton-alta:focus, .boton-alta:active {background-color: rgb(234, 68, 68) !important;}';
    css += '.boton-bloqueante {background-color: rgb(206, 0, 0);animation: boton-6-move 2.5s forwards;}';
    css += '.boton-bloqueante:hover, .boton-bloqueante:focus, .boton-bloqueante:active {background-color: rgb(206, 0, 0) !important;}';
    css += '@keyframes boton-1-move {0% {} 5% {} 80% {transform: translate(40px, 0px);}95% {transform: translate(100px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}100% {transform: translate(100px, 0px); width: 66px; height: 14px; padding: 8px; color: white; border-radius:0; border-top-right-radius: 3px; border-bottom-right-radius: 3px;}}';
    css += '@keyframes boton-2-move {0% {} 5% {} 80% {transform: translate(20px, 0px);}95% {transform: translate(40px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}100% {transform: translate(40px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}}';
    css += '@keyframes boton-3-move {0% {} 5% {} 80% {transform: translate(0px, 0px); }95% {transform: translate(0px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}100% {transform: translate(0px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}}';
    css += '@keyframes boton-4-move {0% {} 5% {} 80% {transform: translate(-20px, 0px);}95% {transform: translate(-40px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}100% {transform: translate(-40px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}}';
    css += '@keyframes boton-5-move {0% {} 5% {} 80% {transform: translate(-40px, 0px);}95% {transform: translate(-80px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}100% {transform: translate(-80px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}}';
    css += '@keyframes boton-6-move {0% {} 5% {} 80% {transform: translate(-60px, 0px);}95% {transform: translate(-120px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}100% {transform: translate(-120px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0; border-top-left-radius: 3px; border-bottom-left-radius: 3px;}}';
    css += '@keyframes rotate-move {0% {filter: url("#goo")}40% {filter: url("#goo")}75% {filter: url("#goo2")}80% {filter: url("#goo3")}85% {filter: url("#goo4")}90% {filter: url("#goo5")}95% {filter: none}100% {filter: none}}';

    var svg = '<svg class="filtros-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" version="1.1"><defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"/></filter><filter id="goo2"><feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"/></filter><filter id="goo3"><feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"/></filter><filter id="goo4"><feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"/></filter><filter id="goo5"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"/></filter></defs></svg>';

    $("body").append(svg);
    $("#header nav .aui-header-primary ul").first().append(botones);
    var style = document.createElement('style');
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
}