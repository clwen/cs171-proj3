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
    "ADM" : "Administration",
    "AS" : "Academic Staff",
    "SS" : "Support Staff",
    "U" : "Undergraduate"
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
        $("." + aff + " rect")
        .css("fill", affColors[aff]);
    }
    } else {
        // Highlight the bar chart
        $("#bar rect")
            .css("fill", "#999");
        $("." + a + " rect")
            .css("fill", affColors[a]);
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
    } else {
        // gray out all the paths
        $(".area").css("fill", "#999");
        // turn on color for selected mode
        var eid_hl = '#' + hl;
        $(eid_hl, "#area-chart").css("fill", comColors[hl]);
        // Highlight the bar chart
        $("#bar rect")
            .css("fill", "#999");
        $("#" + abbrToWord[hl] + " rect")
            .css("fill", comColors[hl]);
    }
};

$(document).ready( function() {
    scrolling();
    renderBarchart("count");
});
