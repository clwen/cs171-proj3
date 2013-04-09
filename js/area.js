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

    d3.csv("data/mit-commuter-data.csv", function(data) {

        var countyDataPre = d3.nest().key(function(d){return d.COUNTY;})
        .rollup(function(d){
            return {
                COUNT:d3.sum(d, function(g){return parseInt(g.COUNT);}),
                AVGDIST:d3.mean(d, function(g){return parseFloat(g.DIST);}),
                MINDIST:d3.min(d, function(g){return parseFloat(g.DIST);}),
                MAXDIST:d3.max(d, function(g){return parseFloat(g.DIST);})
            };
        })
        .entries(data);
        var countyData = {};
        for(var i in countyDataPre){
            countyData[countyDataPre[i].key] = {};
            countyData[countyDataPre[i].key].AVGDIST = countyDataPre[i].values.AVGDIST;
            countyData[countyDataPre[i].key].MAXDIST = countyDataPre[i].values.MAXDIST;
            countyData[countyDataPre[i].key].MINDIST = countyDataPre[i].values.MINDIST;
            countyData[countyDataPre[i].key].COUNT = countyDataPre[i].values.COUNT;
        }

        data.forEach( function(d) {
            // bining distance
            var dist = parseInt(d.DIST);
            if (dist < 10) { dist = dist; }
            else if (dist >= 10 && dist < 15) { dist = 10; }
            else if (dist >= 15 && dist < 20) { dist = 15; }
            else if (dist >= 20 && dist < 25) { dist = 20; }
            else if (dist >= 25 && dist < 30) { dist = 25; }
            else if (dist >= 30 && dist < 35) { dist = 30; }
            else if (dist >= 35 && dist < 40) { dist = 35; }
            else if (dist >= 40 && dist < 45) { dist = 40; }
            else if (dist >= 45 && dist < 50) { dist = 45; }
            else if (dist >= 50 && dist < 60) { dist = 50; }
            else if (dist >= 60 && dist < 70) { dist = 60; }
            else if (dist >= 70 && dist < 80) { dist = 70; }
            else if (dist >= 80 && dist < 90) { dist = 80; }
            else { dist = 80; }
            d.DIST = dist;
            // preprocess modes
            var mode = d.COMMUTE_TYPE;
            if (mode.slice(-2) === "_T") {
                mode = "T";
            }
            d.COMMUTE_TYPE = mode;
        });

        var modes_interested = new Array("WLK", "BIC", "T", "DRV", "CARPOOL", "SHT");
        color.domain(modes_interested);

        var data_by_dist = d3.nest()
            .key(function(d) {return +d.DIST;})
            .sortKeys(d3.ascending)
            .rollup(function(d) {
                return {
                    WLK: d3.sum(d, function(g) {
                        if (g.COMMUTE_TYPE === "WLK") {return g.COUNT;}
                        else {return 0;}
                    }),
                    BIC: d3.sum(d, function(g) {
                        if (g.COMMUTE_TYPE === "BIC") {return g.COUNT;}
                        else {return 0;}
                    }),
                    T: d3.sum(d, function(g) {
                        if (g.COMMUTE_TYPE === "T") {return g.COUNT;}
                        else {return 0;}
                    }),
                    DRV: d3.sum(d, function(g) {
                        if (g.COMMUTE_TYPE === "DRV") {return g.COUNT;}
                        else {return 0;}
                    }),
                    CARPOOL: d3.sum(d, function(g) {
                        if (g.COMMUTE_TYPE === "CARPOOL") {return g.COUNT;}
                        else {return 0;}
                    }),
                    SHT: d3.sum(d, function(g) {
                        if (g.COMMUTE_TYPE === "SHT") {return g.COUNT;}
                        else {return 0;}
                    }),
                    TOTAL: d3.sum(d, function(g) {
                        if ($.inArray(g.COMMUTE_TYPE, modes_interested) !== -1) {return g.COUNT;}
                        else {return 0;}
                    }),
                };
            })
            .entries(data);

        var data_per = new Array(); // data by percentage
        data_by_dist.forEach( function(d) {
            var entry = {
                dist: +d.key,
                WLK: d.values["WLK"] / d.values["TOTAL"],
                BIC: d.values["BIC"] / d.values["TOTAL"],
                T: d.values["T"] / d.values["TOTAL"],
                DRV: d.values["DRV"] / d.values["TOTAL"],
                CARPOOL: d.values["CARPOOL"] / d.values["TOTAL"],
                SHT: d.values["SHT"] / d.values["TOTAL"],
            }
            // make sure this entry do contain at least one data point
            if (d.values["TOTAL"] > 0) {
                data_per.push(entry);
            }
        });

        // sort data_per by distance
        var compare = function(a, b) {
            if (a.dist > b.dist) {return 1;}
            if (a.dist < b.dist) {return -1;}
            else {return 0;}
        };
        data_per.sort(compare);

        var modes = stack(color.domain().map(function(name) {
            return {
                name: name,
                values: data_per.map(function(d) {
                    return {dist: d.dist, y: d[name]};
                })
            };
        }));

        x.domain(d3.extent(data_per, function(d) { return d.dist; }));

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
    }); // end of d3.csv
}); // end of document ready
