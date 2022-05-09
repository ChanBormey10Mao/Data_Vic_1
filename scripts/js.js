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

  var url = "https://api.github.com/repos/pumsuankhaiSEKTAK/australia_energy_dataset/contents/final_australia.json";

  //values will store array of industrial usage data
  //baseEnergy will store the energy usage from the response
  var baseEnergy;
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
  var padding = 60;

  //svg is a d3 selection of the svg area we created for quick access
  var svg = d3.select("svg");

  //generateScales generate the scales and assigns them to the variables
  var generateScales = () => {};

  //draw canvas sets the width and height of the svg canvas to what we specified
  var drawCanvas = () => {
    svg.attr("width", W);
    svg.attr("height", H);
  };

  //drawCell() will draw the rectangular cells
  var drawCells = () => {};

  //generateAxes() will draw the X and Y axis on the canvas
  var generateAxes = () => {};

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
      baseEnergy = ds.energy;

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

        //console.log(totalValue);

        drawCanvas();
        generateScales();
        drawCells();
        generateAxes();
      });
    });
  });
}

window.onload = init;
