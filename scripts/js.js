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
  //user variable to specify svg heigh and width
  var w = 500;
  var h = 200;
  var padding = 5;
  var dataset;

  //load data from csv file
  d3.json("aus-energy.json", function (err, data) {
    if (err) {
      return console.warn(error);
    }
    dataset = data;
    console.log(dataset);

    heatChart(dataset);
  });

  function heatChart(dataset) {
    //create svg element name svg variable
    var svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    //attach dataset to a set of rectable shape
    svg
      .selectAll("rect")
      .data(dataset) //count and prepare the data value
      .enter() //create a new place hoder element for each bit of data
      .append("rect") //append rectagle element to match each place holder
      .attr("x", function (d, i) {
        return i * (w / dataset.length);
      })
      .attr("y", function (d) {
        return h - d.wombats * 5;
      })
      .attr("width", w / dataset.length - padding)
      .attr("height", function (d) {
        return d.wombats * 5 + "px";
      })
      .attr("fill", function (d) {
        return "rgb(0, 0, " + d.wombats * 10 + ")";
      });
  }
}

window.onload = init;
