var abbrToWord = {
    "WLK": "Walk", 
    "BIC": "Bike",
    "T": "T",
    "DRV": "Drive",
    "CARPOOL": "Carpool",
    "SHT": "Shuttle",
};

$(document).ready(function() {
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 1200 - margin.left - margin.right,
        height = 275 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%y-%b-%d").parse,
        formatPercent = d3.format(".0%");

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category20();

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

    d3.csv("data/dist_grouped.csv", function(data) {
        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Distance" && key !== "Total"; }));

        data.forEach(function(d) {
            d.dist = +d.Distance;
            d.WLK = +d.WLK;
            d.BIC = +d.BIC;
            d.T = +d.T;
            d.DRV = +d.DRV;
            d.CARPOOL = +d.CARPOOL;
            d.Total = +d.Total;
        });

        var modes = stack(color.domain().map(function(name) {
            return {
                name: name,
                values: data.map(function(d) {
                    return {dist: d.dist, y: d[name]};
                })
            };
        }));

        x.domain(d3.extent(data, function(d) { return d.dist; }));

        var mode = svg.selectAll(".mode")
            .data(modes)
            .enter().append("g")
            .attr("class", "mode");

        mode.append("path")
            .attr("id", function(d) {return d.name;})
            .attr("class", "area")
            .attr("d", function(d) { return area(d.values); })
            .style("fill", function(d) { return color(d.name); });

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

        var div = d3.select("#area-chart").append("div")
            .attr("class", "area-tooltip")
            .style("opacity", 0);

        $(".area").mouseover(function() {
            $(this).css("fill", "#ecc");

            div.transition()
                .duration(500)
                .style("opacity", 1);
        });

        $(".area").mousemove(function(e) {
            mode = $(this).attr("id");

            div.text(mode)
                .style("left", (e.pageX - 34) + "px")
                .style("up", (e.pageY - 12) + "px");
        });

        $(".area").mouseout(function() {
            $(this).css("fill", color($(this).attr("id")));

            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

        var dist_hl = svg.append("rect")
            .attr("class", "dist-hl")
            .style("opacity", 0);

        // while county clicked, highlight distance range in area chart
        $(".county").click( function(e) {
            e.stopPropagation();
            var county = $(this).attr("id");
            var fips = countyToFips[county];
            if (countyData[fips] === undefined) {
                dist_hl.transition()
                    .duration(500)
                    .style("opacity", 0);
                return;
            }
            var max_dist = countyData[fips].MAXDIST;
            if (max_dist > 80) {max_dist = 80;}
            var min_dist = countyData[fips].MINDIST;
            if (min_dist > 80) {min_dist = 80;}
            var min_x = x(min_dist);
            var max_x = x(max_dist);
            var min_y = y(1);
            var max_y = y(0);
            var w = max_x - min_x;
            if (w === 0) {
                // if it's already to the end, back a bit and set w to 20
                if (max_dist === 80) {
                    min_x -= 20;
                }
                w = 20;
            }
            var h = max_y - min_y;
            dist_hl.transition()
                .duration(500)
                .attr("x", min_x)
                .attr("y", min_y)
                .attr("width", w)
                .attr("height", h)
                .style("fill", "#ff9")
                .style("opacity", "0.3");

                renderBarchart($('input[name=category]:checked').val(), $('input[name=datatype]:checked').val(), fips);
        });

        // clear highlight rect while background clicked
        $("body").click( function() {
            dist_hl.transition()
                .duration(500)
                .style("opacity", 0);
        });

        // toggle between raw number and percentage
        $('input:radio[name=repr]').click(function() {
            var mode = $('input:radio[name=repr]:checked').val();
        });

        // add legend 
        color.domain().forEach( function(d) {
            var card_color = color(d);

            d3.select("#area-legend").append("span")
                .attr("class", "color-card")
                .attr("width", 20 + "px")
                .attr("height", 20 + "px")
                .style("background-color", card_color);

            d3.select("#area-legend").append("span")
                .text(abbrToWord[d]);
        });
    }); // end of d3.csv
}); // end of document ready
