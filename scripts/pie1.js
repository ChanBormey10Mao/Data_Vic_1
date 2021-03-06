function init() {
  var valueYear = 2020;
  const sliderValue = document.querySelector("#InputResult");
  const inputSlider = document.querySelector("#inputYear");
  var width = window.innerWidth - window.innerWidth / 4;
  (height = Math.min(width) / 2 + 100), (margin = 40);

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  var radius = Math.min(width, height) / 2 - margin;
  // shape helper to build arcs:
  var arcGenerator = d3.arc().innerRadius(100).outerRadius(radius);
  var arc = d3
    .arc()
    .innerRadius(radius * 0.8)
    .outerRadius(radius * 0.6);

  // append the svg object to the div called 'my_dataviz'
  var svg = d3
    .select("#pie_chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  svg.append("g").classed("slices", true);
  svg.append("g").classed("labels", true);
  svg.append("g").classed("lines", true);
  var sum = 0;
  var percent = [];
  // Create dummy data
  d3.csv("total_aus_by_states.csv", function (d) {
    var arr1 = [];
    var arr2 = [];

    for (var i = 0; i < d.length; i++) {
      if (d[i].Year == valueYear) {
        arr1[d[i].State] = d[i].Energy;
        sum += parseFloat(d[i].Energy);
        arr2.push(arr1);
      }
    }

    data = arr2[0];

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // Compute the position of each group on the pie:
    var pie = d3.pie().value(function (d) {
      return d.value;
    });
    var data_ready = pie(d3.entries(data));
    // Now I know that group A goes from 0 degrees to x degrees and so on.

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    var mySlices = svg
      .selectAll("mySlices")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("d", arcGenerator)
      .attr("fill", function (d) {
        switch (d.data.key) {
          case "VIC":
            return "blue";
            break;
          case "NSW":
            return "red";
            break;
          case "NT":
            return "green";
            break;
          case "TAS":
            return "grey";
            break;
          case "SA":
            return "yellow";
            break;
          case "WA":
            return "pink";
            break;
          case "QLD":
            return "purple";
            break;
        }
      })
      .attr("stroke", "none")
      .style("stroke-width", "2px");
    // .style("opacity", 0.7);

    mySlices.exit().remove();
    var outerArc;
    /* ------- LINE LABELS  -------*/
    var polyline = svg
      .select(".lines")
      .selectAll("polyline")
      .data(data_ready)
      .enter()
      .append("polyline")
      .attr("points", function (d) {
        // see label transform function for explanations of these three lines.

        if (d.data.key == "NT") {
          outerArc = d3
            .arc()
            .outerRadius(radius * 1)
            .innerRadius(radius * 1);
        } else if (d.data.key == "TAS") {
          outerArc = d3
            .arc()
            .outerRadius(radius * 1)
            .innerRadius(radius * 1.2);
        } else if (d.data.key == "SA") {
          outerArc = d3
            .arc()
            .outerRadius(radius * 1)
            .innerRadius(radius * 0.9);
        } else {
          outerArc = d3
            .arc()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.8);
        }
        var pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      });

    polyline.exit().remove();
    /* ------- TEXT LABELS  -------*/

    var text = svg.select(".labels").selectAll("text").data(data_ready);
    text
      .enter()
      .append("text")
      .text(function (d) {
        return (
          d.data.key +
          "(" +
          parseFloat((d.data.value / sum) * 100).toFixed(2) +
          "%)"
        );
      })
      .attr("transform", function (d) {
        if (d.data.key == "NT") {
          outerArc = d3
            .arc()
            .outerRadius(radius * 1)
            .innerRadius(radius * 1);
        } else if (d.data.key == "TAS") {
          outerArc = d3
            .arc()
            .outerRadius(radius * 1)
            .innerRadius(radius * 1.2);
        } else if (d.data.key == "SA") {
          outerArc = d3
            .arc()
            .outerRadius(radius * 1)
            .innerRadius(radius * 0.9);
        } else {
          outerArc = d3
            .arc()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.8);
        }
        var pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return "translate(" + pos + ")";
      })
      .style("text-anchor", function (d) {
        return midAngle(d) < Math.PI ? "start" : "end";
      });

    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
    // text.exit().remove();
  });

  inputSlider.oninput = () => {
    var outerArc;
    valueYear = inputSlider.value;
    sliderValue.textContent = valueYear;
    console.log("in= " + valueYear);
    sum = 0;
    // sliderValue.style.left = ((valueYear - 1974) * 100).toString() - 46 + "%";
    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.

    // Create dummy data
    d3.csv("total_aus_by_states.csv", function (d) {
      var arr1 = [];
      var arr2 = [];
      for (var i = 0; i < d.length; i++) {
        if (d[i].Year == valueYear) {
          arr1[d[i].State] = d[i].Energy;
          sum += parseFloat(d[i].Energy);
          arr2.push(arr1);
        }
      }
      data = arr2[0];
      console.log(sum);
      var color = d3.scaleOrdinal(d3.schemeCategory10);

      // Compute the position of each group on the pie:
      var pie = d3.pie().value(function (d) {
        return d.value;
      });
      var data_ready = pie(d3.entries(data));
      // Now I know that group A goes from 0 degrees to x degrees and so on.

      var mySlices = svg
        .selectAll("mySlices")
        .data(data_ready)
        .enter()
        .append("path")
        .attr("d", arcGenerator)
        .attr("fill", function (d) {
          switch (d.data.key) {
            case "VIC":
              return "blue";
              break;
            case "NSW":
              return "red";
              break;
            case "NT":
              return "green";
              break;
            case "TAS":
              return "grey";
              break;
            case "SA":
              return "yellow";
              break;
            case "WA":
              return "pink";
              break;
            case "QLD":
              return "purple";
              break;
          }
        });

      mySlices
        .transition()
        .duration(1000)
        .attrTween("d", function (d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            return arcGenerator(interpolate(t));
          };
        });

      mySlices.exit().remove();

      /* ------- LINE LABELS  -------*/
      var polyline = svg
        .select(".lines")
        .selectAll("polyline")
        .data(data_ready);
      polyline
        .enter()
        .append("polyline")
        .attr("points", function (d) {
          // see label transform function for explanations of these three lines.

          var pos = outerArc.centroid(d);
          pos[0] = radius * 1 * (midAngle(d) < Math.PI ? 1 : -1);
          return [arc.centroid(d), outerArc.centroid(d), pos];
        });

      polyline
        .transition()
        .duration(1000)
        .attrTween("points", function (d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            var d2 = interpolate(t);
            if (d.data.key == "NT") {
              outerArc = d3
                .arc()
                .outerRadius(radius * 1)
                .innerRadius(radius * 1);
            } else if (d.data.key == "TAS") {
              outerArc = d3
                .arc()
                .outerRadius(radius * 1)
                .innerRadius(radius * 1.2);
            } else if (d.data.key == "SA") {
              outerArc = d3
                .arc()
                .outerRadius(radius * 1)
                .innerRadius(radius * 0.9);
            } else {
              outerArc = d3
                .arc()
                .outerRadius(radius * 0.8)
                .innerRadius(radius * 0.8);
            }
            var pos = outerArc.centroid(d2);
            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
            return [arc.centroid(d2), outerArc.centroid(d2), pos];
          };
        });
      polyline.exit().remove();
      /* ------- TEXT LABELS  -------*/
      var text = svg.select(".labels").selectAll("text").data(data_ready);
      text
        .enter()
        .append("text")
        .text(function (d) {
          return (
            d.data.key +
            "(" +
            parseFloat((d.data.value / sum) * 100).toFixed(2) +
            "%)"
          );
        })
        .attr("transform", function (d) {
          var pos = outerArc.centroid(d);
          pos[0] = radius * 1 * (midAngle(d) < Math.PI ? 1 : -1);
          return "translate(" + pos + ")";
        })
        .style("text-anchor", function (d) {
          return midAngle(d) < Math.PI ? "start" : "end";
        });
      text
        .transition()
        .duration(1000)
        .attrTween("transform", function (d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            var d2 = interpolate(t);
            if (d.data.key == "NT") {
              outerArc = d3
                .arc()
                .outerRadius(radius * 1)
                .innerRadius(radius * 1);
            } else if (d.data.key == "TAS") {
              outerArc = d3
                .arc()
                .outerRadius(radius * 1)
                .innerRadius(radius * 1.2);
            } else if (d.data.key == "SA") {
              outerArc = d3
                .arc()
                .outerRadius(radius * 1)
                .innerRadius(radius * 0.9);
            } else {
              outerArc = d3
                .arc()
                .outerRadius(radius * 0.8)
                .innerRadius(radius * 0.8);
            }
            var pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
            return "translate(" + pos + ")";
          };
        })
        .text(function (d) {
          return (
            d.data.key +
            "(" +
            parseFloat((d.data.value / sum) * 100).toFixed(2) +
            "%)"
          );
        })
        .styleTween("text-anchor", function (d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            var d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? "start" : "end";
          };
        });

      function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
      }
      text.exit().remove();
    });
  };

  // var svg = d3.select("#pie_chart").append("svg").append("g");
}

window.onload = init;
