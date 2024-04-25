// ==UserScript==
// @name         Jira bug semaphore
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Displays bugs count by colors according to priority
// @author       Manantt
// @match        http://intranet.jira.es/*
// @require      http://code.jquery.com/jquery-3.3.1.js
// @require      https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js
// @resource     bootstrapCSS https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css
// @resource     style https://raw.githubusercontent.com/manantt/jira-bug-semaphore/master/style2.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==
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

var SVG_PROP = '<svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="user" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-user fa-w-14 fa-2x"><g class="fa-group"><path class="alerta" fill="#555" d="M352 128A128 128 0 1 1 224 0a128 128 0 0 1 128 128z" class="fa-secondary"></path><path fill="#888" d="M313.6 288h-16.7a174.1 174.1 0 0 1-145.8 0h-16.7A134.43 134.43 0 0 0 0 422.4V464a48 48 0 0 0 48 48h352a48 48 0 0 0 48-48v-41.6A134.43 134.43 0 0 0 313.6 288z" class="fa-primary"></path></g></svg>';
var SVG_PRUE = '<svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="vial" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512" class="svg-inline--fa fa-vial fa-w-15 fa-2x"><g class="fa-group"><path class="alerta" fill="#555" d="M318 256L138.61 435.44a55.46 55.46 0 0 1-78.39.06 55.46 55.46 0 0 1-.09-78.44L161 256z" class="fa-secondary"></path><path fill="#888" d="M477.65 186.12L309.45 18.33a8 8 0 0 0-11.3 0l-34 33.9a8 8 0 0 0 0 11.29l11.2 11.1L33 316.53c-38.8 38.69-45.1 102-9.4 143.5a102.44 102.44 0 0 0 78 35.9h.4a102.75 102.75 0 0 0 72.9-30.09l246.3-245.71 11.2 11.1a8 8 0 0 0 11.3 0l34-33.89a7.92 7.92 0 0 0-.05-11.22zM141 431.84a54.65 54.65 0 0 1-38.95 16h-.36A54.09 54.09 0 0 1 60 428.76c-8.67-10.08-12.85-23.53-11.76-37.86a64.77 64.77 0 0 1 18.61-40.4l242.4-241.9 78 77.54z" class="fa-primary"></path></g></svg>';
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
    $.post("http://intranet.jira.es/issues/?jql=status%20%3D%20Bloqueado%20AND%20assignee%20in%20(currentUser())%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC", function( data ) {
        var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
        if(typeof cantidad == "undefined"){
            cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
        }
        $("#bloq").html(cantidad);
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
}

function crearDashboard(){
    var storage = window.localStorage;
    var mostrarProp = storage.getItem('mostrarProp') != 'false';
    var mostrarRev = storage.getItem('mostrarRev') != 'false';
    var cerrado = storage.getItem('cerrado') != 'false';

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
    botones += '<a href="http://intranet.jira.es/issues/?jql=status%20%3D%20Bloqueado%20AND%20assignee%20in%20(currentUser())%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC" data-toggle="popover" data-placement="left" data-container="body" data-trigger="hover" class="contenedor" data-content="Bloqueados" id="bloq">?</a>';
    botones += '<a href="http://intranet.jira.es/issues/?jql=status%20in%20(%22Pendiente%20de%20aprobaci%C3%B3n%20por%20Responsable%22%2C%20%22Confirmaci%C3%B3n%20externa%22%2C%22En%20revision%22%2C%22Pull%20request%22%2CProbando%2CPruebas)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC" data-toggle="popover" data-placement="left" data-container="body" data-trigger="hover" class="contenedor pruebas" title="Tickets de revisor" data-content="Ver todos">'+SVG_PRUE+'</a>';
    botones += '<a href="http://intranet.jira.es/issues/?jql=status%20in%20(Pruebas%2C%20Probando)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC" data-toggle="popover" data-placement="left" data-container="body" data-trigger="hover" class="contenedor" data-content="Pruebas" id="pruebas">?</a>';
    botones += '<a href="http://intranet.jira.es/issues/?jql=status%20in%20(%22Pull%20request%22)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC" data-toggle="popover" data-placement="left" data-container="body" data-trigger="hover" class="contenedor" data-content="Pull request" id="pull">?</a>';
    botones += '<a href="http://intranet.jira.es/issues/?jql=status%20in%20(%22En%20revision%22)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC" data-toggle="popover" data-placement="left" data-container="body" data-trigger="hover" class="contenedor" data-content="Revision" id="revision">?</a>';
    botones += '<a href="http://intranet.jira.es/issues/?jql=status%20in%20(%22Confirmaci%C3%B3n%20externa%22)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC" data-toggle="popover" data-placement="left" data-container="body" data-trigger="hover" class="contenedor" data-content="Confirmación externa" id="ext">?</a>';
    botones += '<a href="http://intranet.jira.es/issues/?jql=status%20in%20(%22Pendiente%20de%20aprobaci%C3%B3n%20por%20Responsable%22)%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC" data-toggle="popover" data-placement="left" data-container="body" data-trigger="hover" class="contenedor" data-content="Pendiente aprobación" id="aprob">?</a>';
    
    botones += '</div>';
    botones += '</div>';

    $("body#jira").append(botones);
    if(cerrado) {
        $(".contenedor-dashboard").addClass("cerrado");
        $("#semaforo").addClass("cerrado");
    }
    //
    $("#abrir").click(function() {
        if($("#semaforo").hasClass("cerrado")) {
            $("#semaforo").removeClass("cerrado");
            $(".contenedor-dashboard").removeClass("cerrado");
            storage.setItem('cerrado', "false")
        } else {
            $("#semaforo").addClass("cerrado");
            $(".contenedor-dashboard").addClass("cerrado");
            storage.setItem('cerrado', "true")
        }
    });
}

function addEstilo() {
    const bootstrapCSS = GM_getResourceText("bootstrapCSS");
    const style = GM_getResourceText("style");
    GM_addStyle(bootstrapCSS);
    GM_addStyle(style);
}
