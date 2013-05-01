var abbrToWord = {
    "WLK": "Walk", 
    "BIC": "Bike",
    "T": "MBTA",
    "DRV": "Drive",
    "CARPOOL": "Carpool",
};

var affiliatonDict = {
    "G" : "Graduate",
    "F" : "Faculty",
    "A" : "Administration",
    "AS" : "Academic Staff",
    "SS" : "Support Staff",
    "U" : "Undergraduate"
};

var affiliationCodeDict = {
    "G" : "G",
    "FAC" : "F",
    "ADM" : "A",
    "AS" : "AS",
    "SS" : "SS",
    "U" : "U"
};

var affColors = {
    "G" : "#9999ff",
    "F" : "#99ff99",
    "A" : "#ff99ff",
    "AS" : "#ffff99",
    "SS" : "#ffff99",
    "U" : "#ff6666"
};

var modesUsed = ["WLK", "BIC", "T", "DRV", "CARPOOL"];

var comColors = {
    "WLK": "#9f9",
    "BIC": "#f9f",
    "T": "#ff9",
    "DRV": "#f66",
    "CARPOOL": "#99f",
};

function scrolling() {
    $('ul.nav a').bind('click',function(event){
    var anchor = $(this);

    $('html, body').stop().animate({
        scrollTop: $(anchor.attr('href')).offset().top
    }, 1000);
    
    event.preventDefault();
    });
}

var highlightAffiliation = function(a){
    if (a === "CLEAR") {
    for (var aff in affColors){
        $("rect."+ aff)
        .css("fill", affColors[aff]);
    }
    clearFilter();
    } else {
        // Highlight the bar chart
        $("#bar rect")
            .css("fill", "#999");
        $("rect." + affiliationCodeDict[a])
            .css("fill", affColors[affiliationCodeDict[a]]);
        if(a == "AS" || a == "SS"){
            $("rect.SS")
            .css("fill", affColors["SS"]);
            $("rect.AS")
            .css("fill", affColors["AS"]);
        }
    }
}

var highlightCommuteMode = function(hl) { //highlight is not maintained when area or bar chart is toggled to percentage
    if (hl === "CLEAR") {
        modesUsed.forEach( function(m) {
            var eid = '#' + m;
            $(eid, "#area-chart").css("fill", comColors[m]);
        });
        for (var abbr in abbrToWord){
            $("#" + abbrToWord[abbr] + " rect")
            .css("fill", comColors[abbr]);
        }
        clearFilter();
    } else {
        // gray out all the paths
        $(".area").css("fill", "#999");
        // turn on color for selected mode
        var eid_hl = '#' + hl;
        $(eid_hl, "#area-chart").css("fill", comColors[hl]);
        // Highlight the bar chart
        $("#bar rect")
            .css("fill", "#999");
        console.log(abbrToWord[hl]);
        $("#" + abbrToWord[hl] + " rect")
            .css("fill", comColors[hl]);
    }
};

$(document).ready( function() {
    scrolling();
    renderBarchart("count");

});
