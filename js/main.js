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
        $("#funfact").html("It is about five times as long as equator.");
    } else if (selectedMode !== "all") { // filter according to mode
        if (selectedMode === "WLK") {
            $("#count").html(aggDic["WLK"].count);
            $("#ppl").html("MIT members choose to walk");
            $("#time").html(aggDic["WLK"].time);
            $("#dist").html(aggDic["WLK"].dist);
            $("#funfact").html("It is about 94 times as long as Boston Marathon.");
        } else if (selectedMode === "BIC") {
            $("#count").html(aggDic["BIC"].count);
            $("#ppl").html("MIT members choose to bike");
            $("#time").html(aggDic["BIC"].time);
            $("#dist").html(aggDic["BIC"].dist);
            $("#funfact").html("It is about 1.43 times as long as the 2013 Tour de France.");
        } else if (selectedMode === "T") {
            $("#count").html(aggDic["T"].count);
            $("#ppl").html("MIT members take T");
            $("#time").html(aggDic["T"].time);
            $("#dist").html(aggDic["T"].dist);
            $("#funfact").html("It is about 38 times as long as the whole MBTA system.");
        } else if (selectedMode === "DRV") {
            $("#count").html(aggDic["DRV"].count);
            $("#ppl").html("MIT members who drive");
            $("#time").html(aggDic["DRV"].time);
            $("#dist").html(aggDic["DRV"].dist);
            $("#funfact").html("It is about 23 times as long as the distance from Boston to San Francisco.");
        } else if (selectedMode === "CARPOOL") {
            $("#count").html(aggDic["CARPOOL"].count);
            $("#ppl").html("MIT members who use carpool");
            $("#time").html(aggDic["CARPOOL"].time);
            $("#dist").html(aggDic["CARPOOL"].dist);
            $("#funfact").html("It is about 17 times as long as the distance from Boston to New York.");
        } else {
            console.log("there is no commute mode " + selectedMode);
        }
    } else if (selectedAff !== "all") { // filter according to mode
        if (selectedAff === "U") {
            $("#count").html(aggDic["U"].count);
            $("#ppl").html("MIT undergrads");
            $("#time").html(aggDic["U"].time);
            $("#dist").html(aggDic["U"].dist);
            $("#funfact").html("The time can be used to solve 126 problem sets if each of them take 3 hours to solve.");
        } else if (selectedAff === "G") {
            $("#count").html(aggDic["G"].count);
            $("#ppl").html("MIT grad students");
            $("#time").html(aggDic["G"].time);
            $("#dist").html(aggDic["G"].dist);
            $("#funfact").html("The time can be used to publish 8 papers if each of them take 100 hours to work on.");
        } else if (selectedAff === "FAC") {
            $("#count").html(aggDic["F"].count);
            $("#ppl").html("MIT faculty members");
            $("#time").html(aggDic["F"].time);
            $("#dist").html(aggDic["F"].dist);
            $("#funfact").html("The time can be used to offer 306 sessions of courses if each of them is 90 minutes.");
        } else if (selectedAff === "ADM") {
            $("#count").html(aggDic["A"].count);
            $("#ppl").html("MIT administrative staffs");
            $("#time").html(aggDic["A"].time);
            $("#dist").html(aggDic["A"].dist);
            $("#funfact").html("The time can be used to read 1505 of reports if each of them requires 60 minutes to read.");
        } else if ((selectedAff === "AS") || (selectedAff === "SS")) {
            $("#count").html(aggDic["AS"].count);
            $("#ppl").html("MIT staffs");
            $("#time").html(aggDic["AS"].time);
            $("#dist").html(aggDic["AS"].dist);
            $("#funfact").html("The time can be used to write 2172 of reports if each of them requires 90 minutes to write.");
        } else {
            console.log("there is no affiliation " + selectedAff);
        }
    } else {
        console.log("both filter applied should not happen...");
    }
};

var resetAll = function(){
    $(".well").html("<p>Just in a day, <span id='count'>30</span> <span id='ppl'>MIT Community members</span> spent <span id='time'>10,000</span> minutes traveling a total distance of <span id='dist'>100,000</span> KM. <span id='funfact'>It is almost twice as long as equator.</span></p>");
    if(filtered){
        if(filterType == "Affiliation"){
            highlightAffiliation("CLEAR");
        }
        else if(filterType == "Mode"){
            highlightCommuteMode("CLEAR");
        }
    }
    document.getElementById('mapOptions').reset();
    map.setZoom(12);
    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    showOverlays();
    updateHeader();
    $("#area").css("visibility","visible");
}

$(document).ready( function() {
    scrolling();
    renderBarchart("count");
    updateHeader();

    // STORY ELEMENTS
    $('#story1').click(function() {
        resetAll();
        //$('input:radio[name="datatype"][value="percent"]').click();
        filterMap("T", "Mode");
        highlightCommuteMode("T");
        map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
        $('input:radio[name="stackmode"][value="stacked"]').click();
        $(".well").html("<p>As an university with an urban campus, many members of the MIT community choose to use public transportation to commute to and from campus.</p>");
    });

    $('#story2').click(function() {
        resetAll();
        filterMap("DRV", "Mode");
        highlightCommuteMode("DRV");
        $('input:radio[name="mode"][value="transit"]').click();
        $('input:radio[name="stackmode"][value="multiples"]').click();
        showOverlays();
        $(".well").html("<p>However, there are many people who still drive to campus, even if they live near public transit. These are mostly the faculty, staff and administration.</p>");
    });

    $('#story3').click(function() {
        resetAll();
        filterMap("CARPOOL", "Mode");
        highlightCommuteMode("CARPOOL");
        map.setZoom(10);
        $('input:radio[name="stackmode"][value="multiples"]').click();
        $(".well").html("<p>Also, across all different affiliations and geographies, very few people carpool.</p>");
    });
    
    $('#story4').click(function() {
        resetAll();
        filterMap("WLK", "Mode");
        highlightCommuteMode("WLK");
        $('input:radio[name="mode"][value="transit"]').click();
        $('input:radio[name="datatype"][value="percent"]').click();
        $(".well").html("<p>Despite Cambridge’s very high <a href='http://www.walkscore.com/MA/Cambridge'>walk score</a>, only students living within 5 kilometers of campus tend to choose to commute by walking.</p>");
    });


    $('#story5').click(function() {
        resetAll();
        $('input:radio[name="category"][value="AFFILIATION"]').click();
        filterMap("U", "Affiliation");
        highlightAffiliation("U");
        $('input:radio[name="mode"][value="housing"]').click();
        $('input:radio[name="stackmode"][value="multiples"]').click();
        map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
        showOverlays();
        $(".well").html("<p>Undergraduates tend to live near or on-campus, despite high rental prices. They mostly commute by walking, with some students opting to use the T or bike.</p>");
        $("#area").css("visibility","hidden");
    });

    $('#story6').click(function() {
        resetAll();
        $("#area").css("visibility","hidden");
        $('input:radio[name="category"][value="AFFILIATION"]').click();
        filterMap("G", "Affiliation");
        highlightAffiliation("G");
        $('input:radio[name="mode"][value="bike"]').click();
        $('input:radio[name="stackmode"][value="stacked"]').click();
        showOverlays()
        $(".well").html("<p> While graduate students tend to live near campus, and those living further seem to prefer areas with lower rental costs. They are more likely to take public transit, bike, or walk.</p>");
    });

    $('#explore').click(function() {
        resetAll();
    });

    // trigger intro.js
    $(".help-trigger").click(function(e) {
        introJs().start();
    });
});
