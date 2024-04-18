// ==UserScript==
// @name         Jira bug semaphore
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Displays bugs count by colors according to priority
// @author       Manantt
// @match        http://intranet.jira.es/*
// @require      http://code.jquery.com/jquery-3.3.1.js
// @require      https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js
// @resource     bootstrapCSS https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css
// @resource     style https://raw.githubusercontent.com/manantt/jira-bug-semaphore/master/style.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==
var rutaReabiertosPropios = 'http://intranet.jira.es/issues/?jql=status%20%3D%20Reopened%20and%20assignee%20%3D%20currentUser()%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC';
var url = "http://intranet.jira.es/issues/?jql=";
var prioridades = {
    "bloqueante" : {
        "title":"Prioridad bloqueante",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20in%20(NeT10%2CNeT10-Bugs)%20AND%20priority%20in%20(Bloqueante)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC'
    },
    "muyalta" : {
        "title":"Prioridad muy Alta",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20in%20(NeT10%2CNeT10-Bugs)%20AND%20priority%20in%20(%22Muy%20Alta%22)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC'
    },
    "alta" : {
        "title":"Prioridad alta",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20in%20(NeT10%2CNeT10-Bugs)%20AND%20priority%20in%20(Alta)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC'
    },
    "media" : {
        "title":"Prioridad media",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20in%20(NeT10%2CNeT10-Bugs)%20AND%20priority%20in%20(Media)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC'
    },
    "baja" : {
        "title":"Prioridad baja",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20in%20(NeT10%2CNeT10-Bugs)%20AND%20priority%20in%20(Baja)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC'
    },
    "muybaja" : {
        "title":"Prioridad muy baja",
        "ruta" : "http://intranet.jira.es/issues/?jql=project%20in%20(NeT10%2CNeT10-Bugs)%20AND%20priority%20in%20(%22Muy%20baja%22)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC"
    },
};

var SVG_BUGS = '<svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="bug" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-bug fa-w-16 fa-2x"><g class="fa-group"><path class="alerta" fill="#555" d="M369 112H145a112 112 0 0 1 224 0z" class="fa-secondary"></path><path fill="#888" d="M512 288.9c-.48 17.43-15.22 31.1-32.66 31.1H424v16a143.4 143.4 0 0 1-13.6 61.14l60.23 60.23a32 32 0 0 1-45.26 45.26l-54.73-54.74A143.42 143.42 0 0 1 280 480V236a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v244a143.42 143.42 0 0 1-90.64-32.11l-54.73 54.74a32 32 0 0 1-45.26-45.26l60.23-60.23A143.4 143.4 0 0 1 88 336v-16H32.67C15.23 320 .49 306.33 0 288.9A32 32 0 0 1 32 256h56v-58.74l-46.63-46.63a32 32 0 0 1 45.26-45.26L141.25 160h229.49l54.63-54.63a32 32 0 0 1 45.26 45.26L424 197.26V256h56a32 32 0 0 1 32 32.9z" class="fa-primary"></path></g></svg>';
var SVG_PROP = '<svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="user" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-user fa-w-14 fa-2x"><g class="fa-group"><path class="alerta" fill="#555" d="M352 128A128 128 0 1 1 224 0a128 128 0 0 1 128 128z" class="fa-secondary"></path><path fill="#888" d="M313.6 288h-16.7a174.1 174.1 0 0 1-145.8 0h-16.7A134.43 134.43 0 0 0 0 422.4V464a48 48 0 0 0 48 48h352a48 48 0 0 0 48-48v-41.6A134.43 134.43 0 0 0 313.6 288z" class="fa-primary"></path></g></svg>';
var SVG_REAB = '<svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="redo" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-redo fa-w-16 fa-2x"><g class="fa-group"><path fill="#888" d="M422.36 422.69a12 12 0 0 1 0 17l-.49.46A247.1 247.1 0 0 1 255.67 504c-136.9 0-247.9-110.93-248-247.81C7.57 119.53 119 8 255.67 8a247.45 247.45 0 0 1 188.9 87.33l3.52 64.43-46.5-2.22A176 176 0 1 0 372 388.15a12 12 0 0 1 16.38.54z" class="fa-secondary"></path><path class="alerta" fill="#555" d="M512 12v200a12 12 0 0 1-12 12H300a12 12 0 0 1-12-12v-47.32a12 12 0 0 1 12-12h.58l147.54 7.06-7.44-147.19A12 12 0 0 1 452.07 0H500a12 12 0 0 1 12 12z" class="fa-primary"></path></g></svg>';
var SVG_REV = '<svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="search" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-search fa-w-16 fa-2x"><g class="fa-group"><path class="alerta" fill="#555" d="M208 80a128 128 0 1 1-90.51 37.49A127.15 127.15 0 0 1 208 80m0-80C93.12 0 0 93.12 0 208s93.12 208 208 208 208-93.12 208-208S322.88 0 208 0z" class="fa-secondary"></path><path fill="#888" d="M504.9 476.7L476.6 505a23.9 23.9 0 0 1-33.9 0L343 405.3a24 24 0 0 1-7-17V372l36-36h16.3a24 24 0 0 1 17 7l99.7 99.7a24.11 24.11 0 0 1-.1 34z" class="fa-primary"></path></g></svg>';
var SVG_PRUE = '<svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="vial" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512" class="svg-inline--fa fa-vial fa-w-15 fa-2x"><g class="fa-group"><path class="alerta" fill="#555" d="M318 256L138.61 435.44a55.46 55.46 0 0 1-78.39.06 55.46 55.46 0 0 1-.09-78.44L161 256z" class="fa-secondary"></path><path fill="#888" d="M477.65 186.12L309.45 18.33a8 8 0 0 0-11.3 0l-34 33.9a8 8 0 0 0 0 11.29l11.2 11.1L33 316.53c-38.8 38.69-45.1 102-9.4 143.5a102.44 102.44 0 0 0 78 35.9h.4a102.75 102.75 0 0 0 72.9-30.09l246.3-245.71 11.2 11.1a8 8 0 0 0 11.3 0l34-33.89a7.92 7.92 0 0 0-.05-11.22zM141 431.84a54.65 54.65 0 0 1-38.95 16h-.36A54.09 54.09 0 0 1 60 428.76c-8.67-10.08-12.85-23.53-11.76-37.86a64.77 64.77 0 0 1 18.61-40.4l242.4-241.9 78 77.54z" class="fa-primary"></path></g></svg>';
var SVG_PULL = '<svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="upload" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-upload fa-w-16 fa-2x"><g class="fa-group"><path fill="#888" d="M488 351.92H352v8a56 56 0 0 1-56 56h-80a56 56 0 0 1-56-56v-8H24a23.94 23.94 0 0 0-24 24v112a23.94 23.94 0 0 0 24 24h464a23.94 23.94 0 0 0 24-24v-112a23.94 23.94 0 0 0-24-24zm-120 132a20 20 0 1 1 20-20 20.06 20.06 0 0 1-20 20zm64 0a20 20 0 1 1 20-20 20.06 20.06 0 0 1-20 20z" class="fa-secondary"></path><path class="alerta" fill="#555" d="M192 359.93v-168h-87.7c-17.8 0-26.7-21.5-14.1-34.11L242.3 5.62a19.37 19.37 0 0 1 27.3 0l152.2 152.2c12.6 12.61 3.7 34.11-14.1 34.11H320v168a23.94 23.94 0 0 1-24 24h-80a23.94 23.94 0 0 1-24-24z" class="fa-primary"></path></g></svg>';
(function() {
    crearDashboard();
    cargarDatos();
    addEstilo();
    $('[data-toggle="popover"]').popover();
})();
//
function cargarDatos(){
    // Semaforo
    $.post( prioridades['bloqueante']['ruta'], function( data ) {
        var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
        if(typeof cantidad == "undefined"){
            cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
        }
        $(".item-semaforo-bloqueante").html(cantidad);
    });
    $.post( prioridades['muyalta']['ruta'], function( data ) {
        var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
        if(typeof cantidad == "undefined"){
            cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
        }
        $(".item-semaforo-muyalta").html(cantidad);
    });
    $.post( prioridades['alta']['ruta'], function( data ) {
        var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
        if(typeof cantidad == "undefined"){
            cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
        }
        $(".item-semaforo-alta").html(cantidad);
    });
    $.post( prioridades['media']['ruta'], function( data ) {
        var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
        if(typeof cantidad == "undefined"){
            cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
        }
        $(".item-semaforo-media").html(cantidad);
    });
    $.post( prioridades['baja']['ruta'], function( data ) {
        var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
        if(typeof cantidad == "undefined"){
            cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
        }
        $(".item-semaforo-baja").html(cantidad);
    });
    $.post( prioridades['muybaja']['ruta'], function( data ) {
        var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
        if(typeof cantidad == "undefined"){
            cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
        }
        $(".item-semaforo-muybaja").html(cantidad);
    });
    // Tickets propios
    $.post("http://intranet.jira.es/issues/?jql=status%20%3D%20%22In%20Progress%22%20%20AND%20assignee%20in%20(currentUser())%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC", function( data ) {
        var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
        if(typeof cantidad == "undefined"){
            cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
        }
        $("#progreso").html(cantidad);
    });
    
    $.post("http://intranet.jira.es/issues/?jql=status%20%3D%20Reopened%20AND%20assignee%20in%20(currentUser())%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC", function( data ) {
        var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
        if(typeof cantidad == "undefined"){
            cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
        }
        $("#reabiertos").html(cantidad);
    });
    // Revisores
    $.post("http://intranet.jira.es/issues/?jql=status%20in%20(Pruebas%2C%20Probando)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC", function( data ) {
        var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
        if(typeof cantidad == "undefined"){
            cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
        }
        $("#pruebas").html(cantidad);
    });
    $.post("http://intranet.jira.es/issues/?jql=status%20in%20(%22Pull%20request%22)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC", function( data ) {
        var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
        if(typeof cantidad == "undefined"){
            cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
        }
        $("#pull").html(cantidad);
    });
    $.post("http://intranet.jira.es/issues/?jql=status%20in%20(%22En%20revision%22)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC", function( data ) {
        var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
        if(typeof cantidad == "undefined"){
            cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
        }
        $("#revision").html(cantidad);
    });
    $.post("http://intranet.jira.es/issues/?jql=status%20in%20(%22Confirmaci%C3%B3n%20externa%22)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC", function( data ) {
        var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
        if(typeof cantidad == "undefined"){
            cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
        }
        $("#ext").html(cantidad);
    });
    $.post("http://intranet.jira.es/issues/?jql=status%20in%20(%22Pendiente%20de%20aprobaci%C3%B3n%20por%20Responsable%22)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC", function( data ) {
        var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
        if(typeof cantidad == "undefined"){
            cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
        }
        $("#aprob").html(cantidad);
    });
    /*
     ext
     aprob
*/
}

function crearDashboard(){
    var storage = window.localStorage;
    var mostrarProp = storage.getItem('mostrarProp') != 'false';

    var botones = '<div class="contenedor-dash">';

    botones += '<div id="semaforo">';
    for(key in prioridades){
        botones += '<a data-toggle="popover" data-placement="bottom" data-container="body" data-trigger="hover" class="item-semaforo item-semaforo-'+key+'" data-content="'+prioridades[key]['title']+'" href="'+prioridades[key]['ruta']+'">?</a>';
    }
    botones += '</div>';
    botones += `
        <div id="abrir" title="Mostrar semáforo">
            <svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="traffic-light" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 1024" class="svg-inline--fa fa-traffic-light fa-w-12 fa-2x"><g class="fa-group"><path fill="#ccc" d="M192 320a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0-160a48 48 0 1 0-48-48 48 48 0 0 0 48 48zm0 32a48 48 0 1 0 48 48 48 48 0 0 0-48-48z" class="fa-secondary"></path><path fill="#555" d="M384 192h-64v-37.88c37.2-13.22 64-48.38 64-90.12h-64V32a32 32 0 0 0-32-32H96a32 32 0 0 0-32 32v32H0c0 41.74 26.8 76.9 64 90.12V192H0c0 41.74 26.8 76.9 64 90.12V320H0c0 42.79 28.19 78.61 66.86 91v-.15a128 128 0 0 0 250.34 0v.15c38.61-12.4 66.8-48.22 66.8-91h-64v-37.88c37.2-13.22 64-48.38 64-90.12zM192 416a48 48 0 1 1 48-48 48 48 0 0 1-48 48zm0-128a48 48 0 1 1 48-48 48 48 0 0 1-48 48zm0-128a48 48 0 1 1 48-48 48 48 0 0 1-48 48z" class="fa-primary"></path></g></svg>
        </div>
    `;
    botones += '<div class="contenedor-dashboard">';
    botones += '<a href="http://intranet.jira.es/issues/?jql=status%20in%20(%22In%20Progress%22%2C%22To%20Do%22%2CReopened)%20AND%20assignee%20in%20(currentUser())%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC" data-toggle="popover" data-placement="left" data-container="body" data-trigger="hover" class="contenedor propios" title="Mis tickets" data-content="Tickets asignados al usuario actual (TO DO, IN PROGRESS, REOPENED)">'+SVG_PROP+'</a>';
    botones += '<a href="http://intranet.jira.es/issues/?jql=status%20%3D%20%22In%20Progress%22%20%20AND%20assignee%20in%20(currentUser())%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC" data-toggle="popover" data-placement="left" data-container="body" data-trigger="hover" class="contenedor" id="progreso" data-content="En progreso">?</a>';
    botones += '<a href="http://intranet.jira.es/issues/?jql=status%20%3D%20Reopened%20AND%20assignee%20in%20(currentUser())%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC" data-toggle="popover" data-placement="left" data-container="body" data-trigger="hover" class="contenedor" data-content="Reabiertos" id="reabiertos">?</a>';
    botones += '<a href="http://intranet.jira.es/issues/?jql=status%20in%20(%22Pendiente%20de%20aprobaci%C3%B3n%20por%20Responsable%22%2C%20%22Confirmaci%C3%B3n%20externa%22%2C%22En%20revision%22%2C%22Pull%20request%22%2CProbando%2CPruebas)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC" data-toggle="popover" data-placement="left" data-container="body" data-trigger="hover" class="contenedor pruebas" title="Tickets de revisor" data-content="Ver todos">'+SVG_PRUE+'</a>';
    botones += '<a href="http://intranet.jira.es/issues/?jql=status%20in%20(Pruebas%2C%20Probando)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC" data-toggle="popover" data-placement="left" data-container="body" data-trigger="hover" class="contenedor" data-content="Pruebas" id="pruebas">?</a>';
    botones += '<a href="http://intranet.jira.es/issues/?jql=status%20in%20(%22Pull%20request%22)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC" data-toggle="popover" data-placement="left" data-container="body" data-trigger="hover" class="contenedor" data-content="Pull request" id="pull">?</a>';
    botones += '<a href="http://intranet.jira.es/issues/?jql=status%20in%20(%22En%20revision%22)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC" data-toggle="popover" data-placement="left" data-container="body" data-trigger="hover" class="contenedor" data-content="Revision" id="revision">?</a>';
    botones += '<a href="http://intranet.jira.es/issues/?jql=status%20in%20(%22Confirmaci%C3%B3n%20externa%22)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC" data-toggle="popover" data-placement="left" data-container="body" data-trigger="hover" class="contenedor" data-content="Confirmación externa" id="ext">?</a>';
    botones += '<a href="http://intranet.jira.es/issues/?jql=status%20in%20(%22Pendiente%20de%20aprobaci%C3%B3n%20por%20Responsable%22)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC" data-toggle="popover" data-placement="left" data-container="body" data-trigger="hover" class="contenedor" data-content="Pendiente aprobación" id="aprob">?</a>';
    
    botones += '</div>';
    botones += '</div>';

    $("body").append(botones);
    //
    $("#abrir").click(function() {
        if($("#semaforo").hasClass("cerrado")) {
            $("#semaforo").removeClass("cerrado");
            $(".contenedor-dashboard").removeClass("cerrado");
            
        } else {
            $("#semaforo").addClass("cerrado");
            $(".contenedor-dashboard").addClass("cerrado");
        }
    });
}

function addEstilo() {
    const bootstrapCSS = GM_getResourceText("bootstrapCSS");
    const style = GM_getResourceText("style");
    GM_addStyle(bootstrapCSS);
    GM_addStyle(style);
}
