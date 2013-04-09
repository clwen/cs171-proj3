var maFips = _.range(25001, 25028, 2);
var cData = 0;
var fips = 0;
var bubbleEnlarge = 15;
var cat, type;
var countyToFips = {
    "barnstable": 25001,
    "berkshire": 25003,
    "bristol": 25005,
    "dukes": 25007,
    "essex": 25009,
    "franklin": 25011,
    "hampden": 25013,
    "hampshire": 25015,
    "middlesex": 25017,
    "nantucket": 25019,
    "norfolk": 25021,
    "plymouth": 25023,
    "suffolk": 25025,
    "worcester": 25027,
};
var fipsToCounty = {
    25001: "barnstable",
    25003: "berkshire",
    25005: "bristol",
    25007: "dukes",
    25009: "essex",
    25011: "franklin",
    25013: "hampden",
    25015: "hampshire",
    25017: "middlesex",
    25019: "nantucket",
    25021: "norfolk",
    25023: "plymouth",
    25025: "suffolk",
    25027: "worcester",
};

function getCountyData() {
    d3.csv("data/mit-commuter-data.csv", function(data) {
        // TODO: use key map instead of rollup
        var countyDataPre = d3.nest().key(function(d){return d.COUNTY;})
        .rollup(function(d){
            return {
                COUNT:d3.sum(d, function(g){return parseInt(g.COUNT);}),
                AVGDIST:d3.mean(d, function(g){return parseFloat(g.DIST);}),
                MINDIST:d3.min(d, function(g){return parseFloat(g.DIST);}),
                MAXDIST:d3.max(d, function(g){return parseFloat(g.DIST);}),
                WLK: d3.sum(d, function(g) {
                    if (g.COMMUTE_TYPE === "WLK") {return g.COUNT;}
                    else {return 0;}
                }),
                BIC: d3.sum(d, function(g) {
                    if (g.COMMUTE_TYPE === "BIC") {return g.COUNT;}
                    else {return 0;}
                }),
                T: d3.sum(d, function(g) {
                    if (g.COMMUTE_TYPE.slice(-2) === "_T") {return g.COUNT;}
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
            countyData[countyDataPre[i].key].WLK = countyDataPre[i].values.WLK;
            countyData[countyDataPre[i].key].BIC = countyDataPre[i].values.BIC;
            countyData[countyDataPre[i].key].T = countyDataPre[i].values.T;
            countyData[countyDataPre[i].key].DRV = countyDataPre[i].values.DRV;
            countyData[countyDataPre[i].key].CARPOOL = countyDataPre[i].values.CARPOOL;
            countyData[countyDataPre[i].key].SHT = countyDataPre[i].values.SHT;
        }

        maFips.forEach( function(fips, index, array) {
            var county = fipsToCounty[fips];
            var eid = "#" + county;
            var path = $(eid)[0];
            var bbox = path.getBBox();

            if (countyData[fips] !== undefined) {
                var count = countyData[fips].COUNT;

                d3.select("svg").append("circle")
                    .attr("id", "b" + fips)
                    .attr("fill", "grey")
                    .transition()
                    .duration(500)
                    .attr("cx", bbox.x + bbox.width/2)
                    .attr("cy", bbox.y + bbox.height/2)
                    .attr("r", Math.sqrt(count) * bubbleEnlarge)
                    .style("stroke", "#666")
                    .style("stroke-width", "10")
                    .style("fill", "DarkRed")
                    .style("opacity", 0.8);
            }
        });

        var lastHighLighted;
        $(".county").click( function(e) {
            e.stopPropagation();
            var county = $(this).attr("id");
            fips = countyToFips[county];
            var cid = ".c" + fips;
            if (countyData[fips] === undefined) {
                $("#county-no-data").show();
                setTimeout("$('#county-no-data').hide();", 2000);
            }
            // clear last highlighted county
            if (lastHighLighted !== undefined) {
                d3.selectAll(lastHighLighted).transition()
                    .duration(500)
                    .style("fill", "grey");
            }
            // highlight current county
            lastHighLighted = cid;
            d3.selectAll(cid).transition()
                .duration(500)
                .style("fill", "#ff9");
        });

        // while click on background outside of the map, remove county highlighting
        $(".maps").click(function() {
            if (lastHighLighted !== undefined) {
                d3.selectAll(lastHighLighted).transition()
                    .duration(500)
                    .style("fill", "grey");
            }
            fips = "ALL";
            renderBarchart(cat, type, fips);
        });

        // perpare colors
        var color = d3.scale.category20();
        var modes_interested = new Array("WLK", "BIC", "T", "DRV", "CARPOOL", "SHT");
        color.domain(modes_interested);

        // when hover certain mode in area chart, resize map bubbles
        $(".area").mousemove(function(e) {
            var mode = $(this).attr("id");
            maFips.forEach( function(fips, index, array) {
                var county = fipsToCounty[fips];
                var eid = "#" + county;
                var path = $(eid)[0];
                var bbox = path.getBBox();

                if (countyData[fips] != undefined) {
                    var count = countyData[fips][mode];
                    var bid = "#b" + fips;
                    d3.select(bid)
                        .transition()
                        .duration(500)
                        .attr("r", Math.sqrt(count) * bubbleEnlarge)
                        .style("fill", function(d) { return color(mode);});
                }
            });
        });

        // when mouse out of any area, resize map bubbles to total count
        $(".area").mouseout(function(e) {
            maFips.forEach( function(fips, index, array) {
                var county = fipsToCounty[fips];
                var eid = "#" + county;
                var path = $(eid)[0];
                var bbox = path.getBBox();

                if (countyData[fips] != undefined) {
                    var count = countyData[fips].COUNT;
                    var bid = "#b" + fips;
                    d3.select(bid)
                        .transition()
                        .duration(500)
                        .attr("r", Math.sqrt(count) * bubbleEnlarge)
                        .style("fill", "DarkRed");
                }
            });
        });
    }); // end of d3.csv

    $("#county-no-data").hide();
}

$(document).ready( function() {
    getCountyData();
});
