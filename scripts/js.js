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
function init() {
  var url =
    "https://api.github.com/repos/pumsuankhaiSEKTAK/australia_energy_dataset/contents/final_australia.json";

  //var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

  //values will store array of industrial usage data
  //baseEnergy will store the energy usage from the response
  var baseEnergy;
  var values = [];
  var state;
  var year;
  var agricultureValues;
  var miningValue;
  var manufactValue;
  var electricValue;
  var constructionValue;
  var transportValue;
  var waterValue;
  var commercialValue;
  var residentialValue;
  var otherValue;
  var totalValue;

  //xScale and yScale is used to scale x and y axis
  var xScale;
  var yScale;

  //yAxis and xAxis is used to create x and y axis
  var xAxis;
  var yAxis;

  //width and height shows dimensions of the SVG area
  var W = 1200;
  var H = 600;
  //padding will be the padding in the svg canvas
  var padding = 80;

  //svg is a d3 selection of the svg area we created for quick access
  var svg = d3.select("svg");

  //generateScales generate the scales and assigns them to the variables
  function generateScales() {
    var minYear = d3.min(values, function (d) {
      return d["Year"];
    });

    var maxYear = d3.max(values, function (d) {
      return d["Year"];
    });

    //set the xScale to d3 scaleLinear - year are just integer
    xScale = d3
      .scaleLinear()
      .domain([minYear - 1, maxYear])
      .range([padding, W - padding]);

    //set yScale to a d3 scaleTime - change it later to industry
    //set the range to make sure the axis exists between padding and height - padding vertically
    
    yScale = d3
      .scaleBand()
      //.range([padding, H - padding])
      .range([0, H - padding])
      .domain([
        "Agriculture",
        "Mining",
        "Manufacturing",
        "Electricity",
        "Construction",
        "Transport",
        "Water",
        "Commercial",
        "Residential",
        "Other",
        "Total",
      ])
      .padding([0.8]);
  }

  //Define quantize scale to sort data values into buckets of color
  //Colors taken from colorbrewer
  var color = d3
    .scaleQuantize()
    .range([["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"]]);

  //draw canvas sets the width and height of the svg canvas to what we specified
  function drawCanvas() {
    svg.attr("width", W);
    svg.attr("height", H);
  }

  //drawCell() will draw the rectangular cells
  function drawCells() {
    //select all rectangles in the svg canvas
    //bind them to the values array by calling data()
    //call enter() to specify what to do when there is an array element in no rectangle -> all of them in the case
    //use append() to create new rectangle
    //set the class attribute to "cell" as specified.
    svg
      .selectAll("rect")
      .data(values, function(d){return (
        d.Agriculture +
        ":" +
        d.Mining +
        ":" +
        d.Manufacturing +
        ":" +
        d.Electricity + ":" +
        d.Construction + ":" +
        d.Transport + ":" +
        d.Water + ":" +
        d.Commercial + ":" +
        d.Residential + ":" +
        d.Other + ":" +
        d.Total
      );})
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("fill", function (d) {
         
        if (d.Agriculture <= 50) {
          return "SteelBlue";
        } else if (variance <= 80 && variance >= 51) {
          return "LightSteelBlue";
        } else if (variance <= 100 && variance >= 81) {
          return "Orange";
        } else {
          return "Crimson";
        }
      })
      //call the attribute method to create data-year, data-industry, data-energy usage attribute and just return d
      .attr("data-year", (d) => {
        //set data-year to return the year field from the d
        return d["Year"];
      })
      .attr("data-industry", (d) => {
        return d["Agriculture"];
        
      })
      .attr("data-industry", (d) => {
        return d["Mining"];
      })
      .attr("height", function (d) {
        return (H - (2* padding)) / 11;
      })
      .attr("y", function (d) {
        return yScale(yAxis);
      })
      .attr("width", function (d) {
        var minYear = d3.min(values, function (d) {
          return d["Year"];
        });

        var maxYear = d3.max(values, function (d) {
          return d["Year"];
        });

        let yearCount = maxYear - minYear;

        return (W - (2 * padding)) / yearCount;
      })
      .attr("x", function (d) {
        return xScale(d["Year"]);
      });
  }

  //generateAxes() will draw the X and Y axis on the canvas
  function generateAxes() {
    //create xAxis which an axisbottom that uses the xScale
    //create a new group element in the canvas
    //call xXis to draw the axis in the group element
    //give it an id of x-axis as specified
    //give it a transformation of translate by height - padding downwards on y to push it down to the correct position
    xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    svg
      .append("g")
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("transform", "translate(0, " + (H - padding) + ")")
      .selectAll("text")
      .attr("transform", "translate(-10,10)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", 14)
      .style("fill", "white");

    //create a yAxis which is an existLeft that uses the yScale
    yAxis = d3.axisLeft(yScale);
    svg
      .append("g")
      .call(yAxis)
      .attr("id", "y-axis")
      //give it a transformation of translate by padding right on x to push it right to align with the x axis
      .attr("transform", "translate(" + padding + ", 0)")
      .selectAll("text")
      //.attr("transform", "translate(-10,10)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", 10)
      .style("fill", "white");
  }

  ///Main//
  //load our energy data from github api
  d3.json(url, function (error, data) {
    //check the file loaded properly
    if (error) {
      //is there an error?
      console.log(error); //if so, log it to the console
    } else {
      //If not we're golden!
      //console.log(data); //Now show me the dataset!
    }

    //decoding
    var decodeData = JSON.parse(window.atob(data.content));
    //console.log(decodeData.contents);

    decodeData.contents.forEach(function (ds) {
      //load by state and energy only
      //console.log(ds);

      state = ds.state;
      values = ds.energy;

      ds.energy.forEach(function (innerData) {
        //load data inside energy only

        year = innerData.Year;
        agricultureValues = innerData.Agriculture;
        miningValue = innerData.Mining;
        manufactValue = innerData.Manufacturing;
        electricValue = innerData.Electricity;
        constructionValue = innerData.Construction;
        transportValue = innerData.Transport;
        waterValue = innerData.Water;
        commercialValue = innerData.Commercial;
        residentialValue = innerData.Residential;
        otherValue = innerData.Other;
        totalValue = innerData.Total;

        //console.log(year);

        drawCanvas();
        generateScales();
        drawCells();
        generateAxes();
      });
    });
  });
}

window.onload = init;
