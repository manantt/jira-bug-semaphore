// ==UserScript==
// @name         Jira bug semaphore
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Displays bugs count by colors according to priority
// @author       Manantt
// @match        http://intranet.jira.es/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
})();
var tickets = {
    "bloqueante" : {
        "cantidad" : 0,
        "title":"Bloqueantes",
        "color" : "rgb(206, 0, 0)",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20in%20(NET%2C%20NeT10-Bugs)%20AND%20priority%20in%20(Bloqueante)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC'
    },
    "alta" : {
        "cantidad" : 0,
        "title":"Prioridad alta",
        "color" : "rgb(234, 68, 68)",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20in%20(NET%2C%20NeT10-Bugs)%20AND%20priority%20in%20(Alta)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC'
    },
    "media" : {
        "cantidad" : 0,
        "title":"Prioridad media",
        "color" : "rgb(234, 125, 36)",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20in%20(NET%2C%20NeT10-Bugs)%20AND%20priority%20in%20(Media)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC'
    },
    "baja" : {
        "cantidad" : 0,
        "title":"Prioridad baja",
        "color" : "rgb(42, 135, 53)",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20in%20(NET%2C%20NeT10-Bugs)%20AND%20priority%20in%20(Baja)%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC'
    },
    "muybaja" : {
        "cantidad" : 0,
        "title":"Prioridad muy baja",
        "color" : "rgb(85, 165, 87)",
        "ruta" : 'http://intranet.jira.es/issues/?jql=project%20in%20(NET%2C%20NeT10-Bugs)%20AND%20priority%20in%20("Muy%20baja")%20AND%20statusCategory%20in%20(%22To%20Do%22%2C%20%22In%20Progress%22)%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC'
    },
};
$.post( tickets['bloqueante']['ruta'], function( data ) {
    tickets['bloqueante']['cantidad'] = $(data).find("ol.issue-list li").length;
    $.post( tickets['alta']['ruta'], function( data ) {
        tickets['alta']['cantidad'] = $(data).find("ol.issue-list li").length;
        $.post( tickets['media']['ruta'], function( data ) {
            tickets['media']['cantidad'] = $(data).find("ol.issue-list li").length;
            $.post( tickets['baja']['ruta'], function( data ) {
                tickets['baja']['cantidad'] = $(data).find("ol.issue-list li").length;
                $.post( tickets['muybaja']['ruta'], function( data ) {
                    tickets['muybaja']['cantidad'] = $(data).find("ol.issue-list li").length;
                    createMenu();
                });
            });
        });
    });
});
//
function createMenu(numBloqueantes){
    var botones = '<p class="aui-buttons" style="margin:0 50px">';
    $.each(tickets, function(key, value){
        botones += '<button class="aui-button aui-button-primary" style="margin:0;background-color:'+value['color']+';width:42px;"><a style="padding:0" href="'+value['ruta']+'" title="'+value['title']+'">'+(value['cantidad']>=50?"50+":value['cantidad'])+'</a></button>';
    });
    botones += '<button class="aui-button aui-button-primary" style="margin:0"><a style="padding:0" title="Ver bugs sin asignar ordenados por prioridad" href=\'/issues/?jql=project%20%3D%20ACC%20AND%20statusCategory%20in%20("To%20Do"%2C%20"In%20Progress")%20AND%20(assignee%20%3D%20EMPTY%20OR%20assignee%20%3D%20currentUser())%20AND%20type%20%3D%20Error%20ORDER%20BY%20priority%20DESC%2C%20created%20ASC\'>Ver todos</a></button>';
    botones += '</p>';

    $("#header nav .aui-header-primary ul").first().append(botones);
}