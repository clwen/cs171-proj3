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

var aggDic = {
    "ALL": {"count": 12598, "dist": 202372, "time": 381621}, 
    "WLK": {"count": 2298, "dist": 3977, "time": 47746}, 
    "BIC": {"count": 1207, "dist": 4806, "time": 12016}, 
    "T": {"count": 5025, "dist": 72630, "time": 136190},
    "DRV": {"count": 3630, "dist": 114275, "time": 171430}, 
    "CARPOOL": {"count": 239, "dist": 6049, "time": 12889}, 
    "SHT": {"count": 199, "dist": 634, "time": 1351}, 
    "U": {"count": 2102, "dist": 3192, "time": 22751}, 
    "G": {"count": 3276, "dist": 14501, "time": 45552}, 
    "F": {"count": 774, "dist": 16980, "time": 27573}, 
    "A": {"count": 1642, "dist": 54657, "time": 90270}, 
    "AS": {"count": 4804, "dist": 113041, "time": 195476}, 
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
        $("#" + abbrToWord[hl] + " rect")
            .css("fill", comColors[hl]);
    }
};

var updateHeader = function() {
    if ((selectedMode === "all") && (selectedAff === "all")) { // no filter applied
        $("#count").html(aggDic["ALL"].count);
        $("#ppl").html("MIT community members");
        $("#time").html(aggDic["ALL"].time);
        $("#dist").html(aggDic["ALL"].dist);
    } else if (selectedMode !== "all") { // filter according to mode
        console.log(selectedMode);
        if (selectedMode === "WLK") {
            $("#count").html(aggDic["WLK"].count);
            $("#ppl").html("people choose to walk");
            $("#time").html(aggDic["WLK"].time);
            $("#dist").html(aggDic["WLK"].dist);
        } else if (selectedMode === "BIC") {
            $("#count").html(aggDic["BIC"].count);
            $("#ppl").html("people choose to bike");
            $("#time").html(aggDic["BIC"].time);
            $("#dist").html(aggDic["BIC"].dist);
        }
    } else if (selectedAff !== "all") { // filter according to mode
        console.log("lets show " + selectedAff);
    } else {
        console.log("both filter applied should not happen...");
    }
};

var resetAll = function(){
    if(filtered){
        if(filterType == "Affiliation"){
            highlightAffiliation("CLEAR");
        }
        else if(filterType == "Mode"){
            highlightCommuteMode("CLEAR");
        }
    }
    showOverlays();
    updateHeader();
}

$(document).ready( function() {
    scrolling();
    renderBarchart("count");
    updateHeader();

    $('#story1').click(function() {
        resetAll();
        filterMap("T", "Mode");
        highlightCommuteMode("T");
    });
    $('#story2').click(function() {
        resetAll();
        filterMap("DRV", "Mode");
        highlightCommuteMode("DRV");
    });
    $('#explore').click(function() {
        resetAll();
    });


});
