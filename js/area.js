var abbrToWord = {
    "WLK": "Walk", 
    "BIC": "Bike",
    "T": "MBTA",
    "DRV": "Drive",
    "CARPOOL": "Carpool",
};

var modesUsed = ["WLK", "BIC", "T", "DRV", "CARPOOL"];

var comColors = {
    "WLK": "#9f9",
    "BIC": "#f9f",
    "T": "#ff9",
    "DRV": "#f66",
    "CARPOOL": "#99f",
};

var margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = 1200 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

var color = d3.scale.category20();

var show_percentage = function() {
    var formatPercent = d3.format(".0%");

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatPercent);

    var area = d3.svg.area()
        .x(function(d) { return x(d.dist); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); });

    var stack = d3.layout.stack()
        .values(function(d) { return d.values; });

    var svg = d3.select("#area-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("data/dist_grouped.csv", function(error, data) {
        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Distance" && key !== "Total"; }));

        data.forEach(function(d) {
            d.dist = +d.Distance;
            d.total = +d.Total;
        });

        var modes = stack(color.domain().map(function(name) {
            return {
                name: name,
                values: data.map(function(d) {
                    return {dist: d.dist, y: +d[name]};
                })
            };
        }));

        x.domain(d3.extent(data, function(d) { return d.dist; }));

        var mode = svg.selectAll(".mode")
        .data(modes)
        .enter().append("g")
        .attr("class", "mode");

        mode.append("path")
            .attr("id", function(d) { return d.name })
            .attr("class", "area")
            .attr("d", function(d) { return area(d.values); })
            .style("fill", function(d) { return comColors[d.name]; });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", "-6")
            .style("text-anchor", "end")
            .text("Distance (km)");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // tooltip
        d3.selectAll("#area-chart path")
            .on("mousemove", function (d) {
                var html_to_show = abbrToWord[$(this).attr("id")];
                window.lastX = event.pageX;
                window.lastY = event.pageY;
                var ttOffset = 8;
                var x = window.lastX + ttOffset;
                var y = window.lastY + ttOffset;
                $("#area-tooltip")
                .removeClass("invisible")
                .show()
                .html(html_to_show)
                .css("position", "absolute")
                .css("left", x + "px")
                .css("top", y + "px")
                .css("padding", "15px");
            })
            .on("mouseleave", function () {
                $("#area-tooltip").fadeOut();
            });
    }); // end of d3.csv
};

var show_number = function() {
    var formatInt = d3.format("d");

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatInt);

    var area = d3.svg.area()
        .x(function(d) { return x(d.dist); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); });

    var stack = d3.layout.stack()
        .values(function(d) { return d.values; });

    var svg = d3.select("#area-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("data/dist_grouped.csv", function(error, data) {
        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Distance" && key !== "Total"; }));

        data.forEach(function(d) {
            d.dist = +d.Distance;
            d.total = +d.Total;
        });

        var modes = stack(color.domain().map(function(name) {
            return {
                name: name,
                values: data.map(function(d) {
                    return {dist: d.dist, y: +d[name] * d.total};
                })
            };
        }));

        x.domain(d3.extent(data, function(d) { return d.dist; }));
        y.domain(d3.extent(data, function(d) { return d.total; }));

        var mode = svg.selectAll(".mode")
        .data(modes)
        .enter().append("g")
        .attr("class", "mode");

        mode.append("path")
            .attr("id", function(d) { return d.name })
            .attr("class", "area")
            .attr("d", function(d) { return area(d.values); })
            .style("fill", function(d) { return comColors[d.name]; });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", "-6")
            .style("text-anchor", "end")
            .text("Distance (km)");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
        
        // tooltip
        d3.selectAll("#area-chart path")
            .on("mousemove", function (d) {
                var html_to_show = abbrToWord[$(this).attr("id")];
                window.lastX = event.pageX;
                window.lastY = event.pageY;
                var ttOffset = 8;
                var x = window.lastX + ttOffset;
                var y = window.lastY + ttOffset;
                $("#area-tooltip")
                .removeClass("invisible")
                .show()
                .html(html_to_show)
                .css("position", "absolute")
                .css("left", x + "px")
                .css("top", y + "px")
                .css("padding", "15px");
            })
            .on("mouseleave", function () {
                $("#area-tooltip").fadeOut();
            });
    }); // end of d3.csv
};

var highlightCommuteMode = function(hl) {
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

$(document).ready(function() {
    // toggle between raw number and percentage
    $('input:radio[name=repr]').click(function() {
        var mode = $('input:radio[name=repr]:checked').val();
        if (mode === "percentage") {
            d3.select("#area-chart svg")
                .remove();
            show_percentage();
        } else if (mode === "number") {
            d3.select("#area-chart svg")
                .remove();
            show_number();
        }
    });

    show_percentage();

    // add legend
    modesUsed.forEach( function(d) {
        var card_color = comColors[d];

        d3.select("#area-legend").append("span")
            .attr("class", "color-card")
            .attr("width", 20 + "px")
            .attr("height", 20 + "px")
            .style("background-color", card_color);

        d3.select("#area-legend").append("span")
            .text(abbrToWord[d]);
    });
}); // end of document.ready
