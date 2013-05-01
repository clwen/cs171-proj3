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

var aggDic = {"A": {"count": 1642, "dist": 54657.111147355005, "time": 90269.94654855637}, "ALL": {"count": 12598, "dist": 202371.6037862508, "time": 381621.3923733227}, "SHT": {"count": 199, "dist": 633.9189179643259, "time": 1350.7754484636998}, "G": {"count": 3276, "dist": 14500.511186471966, "time": 45551.998557953506}, "F": {"count": 774, "dist": 16980.2829961154, "time": 27572.751660188802}, "CARPOOL": {"count": 239, "dist": 6048.949266858281, "time": 12889.30165534954}, "BIC": {"count": 1207, "dist": 4806.440198730774, "time": 12016.100496832001}, "DRV": {"count": 3630, "dist": 114275.02876874004, "time": 171429.68612177295}, "AS": {"count": 4804, "dist": 113041.2666589353, "time": 195476.1737020966}, "WLK": {"count": 2298, "dist": 3977.2141806018744, "time": 47745.66843456179}, "U": {"count": 2102, "dist": 3192.4317973732527, "time": 22750.521904527508}, "T": {"count": 5025, "dist": 72630.05245335559, "time": 136189.86021634276}};

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
        $("#" + abbrToWord[hl] + " rect")
            .css("fill", comColors[hl]);
    }
};

$(document).ready( function() {
    scrolling();
    renderBarchart("count");
});
