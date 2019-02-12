// ==UserScript==
// @name         Jira bug semaphore
// @namespace    http://tampermonkey.net/
// @version      0.11
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
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20%3D%20NeT10-Bugs%20AND%20priority%20in%20(Bloqueante)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC'
    },
    "alta" : {
        "cantidad" : 0,
        "title":"Prioridad alta",
        "color" : "rgb(234, 68, 68)",
        "borde" : "rgb(176, 19, 19)",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20%3D%20NeT10-Bugs%20AND%20priority%20in%20(Alta)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC'
    },
    "media" : {
        "cantidad" : 0,
        "title":"Prioridad media",
        "color" : "rgb(234, 125, 36)",
        "borde" : "rgb(160, 80, 15)",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20%3D%20NeT10-Bugs%20AND%20priority%20in%20(Media)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC'
    },
    "baja" : {
        "cantidad" : 0,
        "title":"Prioridad baja",
        "color" : "rgb(42, 135, 53)",
        "borde" : "rgb(27, 87, 34)",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20%3D%20NeT10-Bugs%20AND%20priority%20in%20(Baja)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC'
    },
    "muybaja" : {
        "cantidad" : 0,
        "title":"Prioridad muy baja",
        "color" : "rgb(85, 165, 87)",
        "borde" : "rgb(55, 107, 56)",
        "ruta" : "http://intranet.jira.es/issues/?jql=project%20%3D%20NeT10-Bugs%20AND%20priority%20in%20(\'Muy%20baja\')%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC"
    },
};
(function() {
    crearSemaforo();
    falificar();
})();

$.post( tickets['bloqueante']['ruta'], function( data ) {
    var cantidad = data.match(/(total&quot;:)(\d)+(,&quot;)/g)[0].replace("total&quot;:", "").replace(",&quot;", "");
    if(typeof cantidad == "undefined"){
        cantidad = $(data).find("ol.issue-list li").length == "50" ? "50+" : $(data).find("ol.issue-list li").length;
    }
    $(".boton-bloqueante").html(cantidad);
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
//
function crearSemaforo(){
    var botones = '<div class="contenedor-botones">';
    botones += '<a class="boton boton-todos" title="Ver bugs sin asignar ordenados por prioridad" href=\'/issues/?jql=project%20%3D%20ACC%20AND%20statusCategory%20in%20("To%20Do"%2C%20"In%20Progress")%20AND%20(assignee%20%3D%20EMPTY%20OR%20assignee%20%3D%20currentUser())%20AND%20type%20%3D%20Error%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC\'>Ver todos</a>';
    for(key in tickets){
        botones += '<a class="boton boton-'+key+'" title="'+tickets[key]['title']+'" href="'+tickets[key]['ruta']+'">?</a>';
    }
    botones += '</div>';

    var css = '.contenedor-botones {width: 240px;height: 40px;position: absolute;top: 20px;left: 60%;transform: translate(-50%, -50%);margin: auto;filter: url("#goo");animation: rotate-move 2s forwards;}';
    css += '.boton { width: 30px;height: 30px;border-radius: 50%;background-color: #000;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;padding:0 !important; color: transparent;font-weight: bold;-webkit-font-smoothing: antialiased;font-family: Arial, sans-serif;font-size: 14px;text-align: center;overflow: hidden;white-space: pre;}';
    css += '.boton:hover {filter: brightness(120%);cursor: pointer;}';
    css += '.boton-todos {background-color: #3572b0;animation: boton-1-move 2s forwards;}';
    css += '.boton-todos:hover, .boton-todos:focus, .boton-todos:active {background-color: #3572b0 !important;}';
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
    css += '@keyframes boton-1-move {0% {} 5% {} 80% {transform: translate(40px, 0px);}93% {transform: translate(100px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}100% {transform: translate(100px, 0px); width: 66px; height: 14px; padding: 8px; color: white; border-radius:0; border-top-right-radius: 3px; border-bottom-right-radius: 3px;}}';
    css += '@keyframes boton-2-move {0% {} 5% {} 80% {transform: translate(20px, 0px);}93% {transform: translate(40px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}98% {transform: translate(40px, 0px); width: 32px; height: 22px; padding: 8px; color: white; border-radius:0;}100% {transform: translate(40px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}}';
    css += '@keyframes boton-3-move {0% {} 5% {} 80% {transform: translate(0px, 0px); }93% {transform: translate(0px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}96% {transform: translate(0px, 0px); width: 32px; height: 22px; padding: 8px; color: white; border-radius:0;}100% {transform: translate(0px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}98% {transform: translate(0px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}}';
    css += '@keyframes boton-4-move {0% {} 5% {} 80% {transform: translate(-20px, 0px);}93% {transform: translate(-40px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}94% {transform: translate(-40px, 0px); width: 32px; height: 22px; padding: 8px; color: white; border-radius:0;}96% {transform: translate(-40px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}100% {transform: translate(-40px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}}';
    css += '@keyframes boton-5-move {0% {} 5% {} 80% {transform: translate(-40px, 0px);}93% {transform: translate(-80px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}96% {transform: translate(-80px, 0px); width: 32px; height: 22px; padding: 8px; color: white; border-radius:0;}98% {transform: translate(-80px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}100% {transform: translate(-80px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0;}}';
    css += '@keyframes boton-6-move {0% {} 5% {} 80% {transform: translate(-60px, 0px);}93% {transform: translate(-120px, 0px); width: 30px; height: 30px; padding: 0; color:transparent; border-radius:50%}98% {transform: translate(-120px, 0px); width: 32px; height: 22px; padding: 8px; color: white; border-radius:0; border-top-left-radius: 3px; border-bottom-left-radius: 3px;}100% {transform: translate(-120px, 0px); width: 24px; height: 14px; padding: 8px; color: white; border-radius:0; border-top-left-radius: 3px; border-bottom-left-radius: 3px;}}';
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