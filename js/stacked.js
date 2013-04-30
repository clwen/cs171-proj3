// STACKED to MULTIPLES BARCHART

var affcolors = ['#ff99ff', '#ffff99', '#99ff99', '#9999ff','#ffff99', '#ff6666'];
var comcolors = ['#99ff99', '#ff6666', '#ff99ff', '#ffff99', '#9999ff'];

function renderBarchart(datatype){
  d3.select("#barchart").remove();
  var buckets = $('input[name=bucket]:checked').val();
  var datafile = "data/commutes-by-area.csv";
  var color;
  if(buckets == 'Affiliation'){
    datafile = "data/commutes-by-area-aff.csv";
    color = affcolors;
  }
  else if(buckets == 'Commute'){
    datafile = "data/commutes-by-area-mode.csv";
    color = comcolors;
  }
  if(datatype == "count"){
    var margin = {top: 10, right: 40, bottom: 20, left: 60},
      width = 520 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    var y0 = d3.scale.ordinal()
        .rangeRoundBands([height, 0], .2);

    var y1 = d3.scale.linear();

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1, 0);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var nest = d3.nest()
        .key(function(d) { return d.COMMUTE_TYPE; });

    var stack = d3.layout.stack()
        .values(function(d) { return d.values; })
        .x(function(d) { return d.AFFILIATION; })
        .y(function(d) { return d.COUNT; })
        .out(function(d, y0) { d.valueOffset = y0; });

    var svg = d3.select("#bar").append("svg").attr("id", "barchart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(datafile, function(error, data) {
      // Notes about the data:
      // Changing the SORT ORDER of the spreadsheet changes the chart from raw # to COUNTages
      // changing the "group" number changes the color scheme

      data.forEach(function(d) {
        d.COUNT = +d.COUNT;
      });

      var dataByGroup = nest.entries(data);

      stack(dataByGroup);
      x.domain(dataByGroup[0].values.map(function(d) {return d.AFFILIATION; }));
      y0.domain(dataByGroup.map(function(d) { return d.key; }));
      y1.domain([0, d3.max(data, function(d) { return d.COUNT; })]).range([y0.rangeBand(), 0]);

      var group = svg.selectAll(".group")
          .data(dataByGroup)
        .enter().append("g")
          .attr("class", "group").attr("id", function(d){ return d.key})
          .attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });

      group.append("text")
          .attr("class", "group-label")
          .attr("x", -6)
          .attr("y", function(d) { return y1(d.values[0].COUNT / 2); })
          .attr("dy", ".35em")
          .text(function(d) { return d.key; });

      group.selectAll("rect")
          .data(function(d) { return d.values; })
        .enter().append("rect")
          .style("fill", function(d) { return color[d.group-1]; })
          .attr("x", function(d) { return x(d.AFFILIATION); })
          .attr("y", function(d) { return y1(d.COUNT); })
          .attr("width", x.rangeBand())
          .attr("height", function(d) { return y0.rangeBand() - y1(d.COUNT); })
          .attr("class", function(d){return d.AFFILIATION_CODE}); 

      // TOOLTIP
      d3.selectAll("rect")
        .on("mousemove", function (d) {
          var html_to_show = d.AFFILIATION + "<br/>" + "Total Population: " + d.COUNT;
          console.log(d3.mouse(this));
          $("#tooltip")
              .removeClass("invisible")
              .show()
              .html(html_to_show)
              .css("position", "absolute")
              .css("left", (d3.mouse(this)[0]) + "px")
              .css("top", (d3.mouse(this)[1]) + "px")
              .css("padding", "15px");
        })
        .on("mouseleave", function () {
          $("#tooltip").fadeOut();
      });

      group.filter(function(d, i) { return !i; }).append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + y0.rangeBand() + ")")
          .call(xAxis);

      d3.selectAll("input").on("change", change);

      function change() {
        if (this.value === "multiples") transitionMultiples();
        else transitionStacked();
      }

      function transitionMultiples() {
        var t = svg.transition().duration(750),
            g = t.selectAll(".group").attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
        g.selectAll("rect").attr("y", function(d) { return y1(d.COUNT); });
        g.select(".group-label").attr("y", function(d) { return y1(d.values[0].COUNT / 2); })
      }

      function transitionStacked() {
        var t = svg.transition().duration(750),
            g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
        g.selectAll("rect").attr("y", function(d) { return y1(d.COUNT + d.valueOffset); });
        g.select(".group-label").attr("y", function(d) { return y1(d.values[0].COUNT / 2 + d.values[0].valueOffset); })
      }
    });

  }
  else if (datatype == "percent"){
    var margin = {top: 10, right: 40, bottom: 20, left: 60},
      width = 500 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    var y0 = d3.scale.ordinal()
        .rangeRoundBands([height, 0], .2);

    var y1 = d3.scale.linear();

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1, 0);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var nest = d3.nest()
        .key(function(d) { return d.COMMUTE_TYPE; });

    var stack = d3.layout.stack()
        .values(function(d) { return d.values; })
        .x(function(d) { return d.AFFILIATION; })
        .y(function(d) { return d.PERCENT; })
        .out(function(d, y0) { d.valueOffset = y0; });

    var svg = d3.select("#bar").append("svg").attr("id", "barchart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(datafile, function(error, data) {
      // Notes about the data:
      // Changing the SORT ORDER of the spreadsheet changes the chart from raw # to COUNTages
      // changing the "group" number changes the color scheme

      data.forEach(function(d) {
          d.PERCENT = +d.PERCENT;
      });

      var dataByGroup = nest.entries(data);

      stack(dataByGroup);
      x.domain(dataByGroup[0].values.map(function(d) {return d.AFFILIATION; }));
      y0.domain(dataByGroup.map(function(d) { return d.key; }));
      y1.domain([0, d3.max(data, function(d) { return d.PERCENT; })]).range([y0.rangeBand(), 0]);

      var group = svg.selectAll(".group")
          .data(dataByGroup)
        .enter().append("g")
          .attr("class", "group")
          .attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });

      group.append("text")
          .attr("class", "group-label")
          .attr("x", -6)
          .attr("y", function(d) { return y1(d.values[0].PERCENT / 2); })
          .attr("dy", ".35em")
          .text(function(d) { return d.key; });

      group.selectAll("rect")
          .data(function(d) { return d.values; })
        .enter().append("rect")
          .style("fill", function(d) { return color[d.group-1]; })
          .attr("x", function(d) { return x(d.AFFILIATION); })
          .attr("y", function(d) { return y1(d.PERCENT); })
          .attr("width", x.rangeBand())
          .attr("height", function(d) { return y0.rangeBand() - y1(d.PERCENT); });

      // TOOLTIP
      d3.selectAll("rect")
        .on("mousemove", function (d) {
          var html_to_show = d.AFFILIATION + "<br/>" + "Percentage: " + Math.floor(d.PERCENT) + "%";
          console.log(d3.mouse(this));
          $("#tooltip")
              .removeClass("invisible")
              .show()
              .html(html_to_show)
              .css("position", "absolute")
              .css("left", (d3.mouse(this)[0]) + "px")
              .css("top", (d3.mouse(this)[1]) + "px")
              .css("padding", "15px");
        })
        .on("mouseleave", function () {
          $("#tooltip").fadeOut();
      }); 

      group.filter(function(d, i) { return !i; }).append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + y0.rangeBand() + ")")
          .call(xAxis);

      d3.selectAll("#barmode").on("change", change);

      function change() {
        if (this.value === "multiples") transitionMultiples();
        else transitionStacked();
      }

      function transitionMultiples() {
        var t = svg.transition().duration(750),
            g = t.selectAll(".group").attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
        g.selectAll("rect").attr("y", function(d) { return y1(d.PERCENT); });
        g.select(".group-label").attr("y", function(d) { return y1(d.values[0].PERCENT / 2); })
      }

      function transitionStacked() {
        var t = svg.transition().duration(750),
            g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
        g.selectAll("rect").attr("y", function(d) { return y1(d.PERCENT + d.valueOffset); });
        g.select(".group-label").attr("y", function(d) { return y1(d.values[0].PERCENT / 2 + d.values[0].valueOffset); })
      }
    });
  }
  
}