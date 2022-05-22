/* Australia Map
//Define map projection
var projection = d3.geo.mercator()
    .center([117.00, -30.06])
    .scale(650)
    //.translate([width/2,height/2]);
   

//Define path generator
var path = d3.geo.path()
    .projection(projection);

//Create SVG element
var svg = d3.select("body")
    .append("svg")
    .attr({
        width: w + margin,
        height: h + margin
    })


    //load from dataset json file
    d3.json("aus-energy.json", )

//Load in GeoJSON data
d3.json("aus-state.json", function (geo_data) {

    //debugger;
    var map = svg.selectAll('path')
        .data(geo_data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style("fill", "rgb(9, 157, 217)")
        .style("stroke", "darkblue")
        .style("stroke-width", 0.8);
});

*/


/*
Industry Modification for databset
industry 1 => agriculture
industry 2 => mining
industry 3 => manufacturing
industry 4 => electricity
industry 5 => construction
industry 6 => transport
industry 7 => water
industry 8 => commercial
industry 9 => residential
industry 10 => others

Year modification for dataset
1974 => 1
1975 => 2
1976 => 3
....
2019 => 46
2020 => 47

*/



function init() {
  var dataset;
  var industry = [
      "Agriculture",
      "Mining",
      "Manufacturing",
      "Electricity",
      "Construction",
      "Transport",
      "Water",
      "Commercial",
      "Residential",
      "Others",
    ],
    years = d3.range(1974, 2021);

  var margin = { top: 40, right: 50, bottom: 50, left: 70 };

  // calculate width and height based on window size
  var w =
      Math.max(Math.min(window.innerWidth, 1800), 500) -
      margin.left -
      margin.right -
      20,
    gridSize = Math.floor(w / years.length),
    h = gridSize * (industry.length + 2);

  //reset the overall font size
  var newFontSize = (w * 30) / 900;
  d3.select("html").style("font-size", newFontSize + "%");

  // svg container
  var svg = d3
    .select("#heatmap")
    .append("svg")
    .attr("width", w + margin.top + margin.bottom)
    .attr("height", h + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var industryLable = svg
    .selectAll(".industryLable")
    .data(industry)
    .enter()
    .append("text")
    .text(function (d) {
      return d;
    })
    .attr("x", 0)
    .attr("y", function (d, i) {
      return i * gridSize;
    })
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + gridSize / 1.5 + ")");

  var yearLabel = svg
    .selectAll(".yearLabel")
    .data(years)
    .enter()
    .append("text")
    .text(function (d) {
      return d;
    })
    .attr("x", function (d, i) {
      return i * gridSize;
    })
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)");

  // load data
  d3.json("australia_energy_usage.json", function (error, data) {
    data.forEach(function (d) {
      d.industry = +d.industry;
      d.year = +d.year;
      d.value = +d.value;
    });
    dataset = data;

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // linear colour scale
    var colours = d3
      .scaleLinear()
      .domain(d3.range(1, 11, 1))
      .range([
        "#ffffcc",
        "#ffeda0",
        "#fed976",
        "#feb24c",
        "#fd8d3c",
        "#fc4e2a",
        "#e31a1c",
        "#bd0026",
        "#800026",
      ]);

    // group data by location
    var nest = d3
      .nest()
      .key(function (d) {
        return d.location;
      })
      .entries(dataset);

    // array of locations in the data
    var locations = nest.map(function (d) {
      return d.key;
    });
    var currentLocationIndex = 0;

    // create location dropdown menu
    var locationMenu = d3.select("#locationDropdown");
    locationMenu
      .append("select")
      .attr("id", "locationMenu")
      .selectAll("option")
      .data(locations)
      .enter()
      .append("option")
      .attr("value", function (d, i) {
        return i;
      })
      .text(function (d) {
        return d;
      });

    // function to create the initial heatmap
    function drawHeatmap(location) {
      // filter the data to return object of location of interest
      var selectLocation = nest.find(function (d) {
        return d.key == location;
      });

      svg
        .selectAll(".year")
        .data(selectLocation.values)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return (d.year - 1) * gridSize;
        })
        .attr("y", function (d) {
          return (d.industry - 1) * gridSize;
        })
        .attr("class", "year bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("stroke", "white")
        .style("stroke-opacity", 0.6)
        .style("fill", function (d) {
          return color(d.value);
        });
    }

    drawHeatmap(locations[currentLocationIndex]);

    var updateHeatmap = function (location) {
      console.log("currentLocationIndex: " + currentLocationIndex);
      // filter data to return object of location of interest
      var selectLocation = nest.find(function (d) {
        return d.key == location;
      });

      // update the data and redraw heatmap
      var heatmap = svg
        .selectAll(".year")
        .data(selectLocation.values)
        .transition()
        .duration(500)
        .style("fill", function (d) {
          return color(d.value);
        });
    };

    // run update function when dropdown selection changes
    locationMenu.on("change", function () {
      // find which location was selected from the dropdown
      var selectedLocation = d3.select(this).select("select").property("value");
      currentLocationIndex = +selectedLocation;
      // run update function with selected location
      updateHeatmap(locations[currentLocationIndex]);
    });

    d3.selectAll(".nav").on("click", function () {
      if (d3.select(this).classed("left")) {
        if (currentLocationIndex == 0) {
          currentLocationIndex = locations.length - 1;
        } else {
          currentLocationIndex--;
        }
      } else if (d3.select(this).classed("right")) {
        if (currentLocationIndex == locations.length - 1) {
          currentLocationIndex = 0;
        } else {
          currentLocationIndex++;
        }
      }
      d3.select("#locationMenu").property("value", currentLocationIndex);
      updateHeatmap(locations[currentLocationIndex]);
    });

    //////////////// Create the gradient for the legend ///////////////////////
    ///////////////////////////////////////////////////////////////////////////

    //Extra scale since the color scale is interpolated
    var countScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(dataset, function (d) {
          return d.value;
        }),
      ])
      .range([0, w]);

    //Calculate the variables for the temp gradient
    var numStops = 10;
    var countRange = countScale.domain();
    countRange[2] = countRange[1] - countRange[0];
    countPoint = [];
    for (var i = 0; i < numStops; i++) {
      countPoint.push((i * countRange[2]) / (numStops - 1) + countRange[0]);
    } //for i

    //Create the gradient
    svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "legend-traffic")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%")
      .selectAll("stop")
      .data(d3.range(numStops))
      .enter()
      .append("stop")
      .attr("offset", function (d, i) {
        return countScale(countPoint[i]) / w;
      })
      .attr("stop-color", function (d, i) {
        return color(countPoint[i]);
      });

    ////////////////////////// Draw the legend ////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    var legendWidth = Math.min(w * 0.8, 400);
    //Color Legend container
    var legendsvg = svg
      .append("g")
      .attr("class", "legendWrapper")
      .attr(
        "transform",
        "translate(" + w / 2 + "," + (gridSize * industry.length + 40) + ")"
      );

    //Draw the Rectangle
    legendsvg
      .append("rect")
      .attr("class", "legendRect")
      .attr("x", -legendWidth / 2)
      .attr("y", 0)
      //.attr("rx", hexRadius*1.25/2)
      .attr("width", legendWidth)
      .attr("height", 8)
      .style("fill", "url(#legend-traffic)");

    //Append title
    legendsvg
      .append("text")
      .attr("class", "legendTitle")
      .attr("x", 0)
      .attr("y", -10)
      .style("text-anchor", "middle")
      .text("Australia Energy Usage in PJ (Petajoule)");

    //Set scale for x-axis
    var xScale = d3
      .scaleLinear()
      .range([-legendWidth / 2, legendWidth / 2])
      .domain([
        //calculate the min value
        d3.min(dataset, function (d) {
          //looking at the first number in the array
          return d["value"];
        }),
        //calculating the max value
        d3.max(dataset, function (d) {
          //looking at the first number in the array
          return d["value"];
        }),
      ]);

    //Define x-axis
    var xAxis = d3
      .axisBottom()
      //putting the space by 5
      .ticks(5)
      //scale the x scale
      .scale(xScale);

    //.scale(xScale);

    //Set up X axis
    legendsvg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + 10 + ")")
      .call(xAxis);
  });

}

window.onload = init;
