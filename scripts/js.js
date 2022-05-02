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
  //set the dimensions and margins of the length
  var margin = { top: 30, right: 30, bottom: 30, left: 30 };
  var w = 500;
  var h = 200;


  //append the svg object to the body of the page
  var svg = d3.select("#canvas")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


  //labels "of row and columns
  var xAxisLabel = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  var yAxisLabel = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"];

  //build x scales and axis: 
  var xAxis = d3.scaleBand()
    .range([0, w])
    .domain(xAxisLabel)
    .padding(0.01);

  svg.append("g")
    .attr("transform", "translate(0, " + h + ")")
    .call(d3.axisBottom(xAxis))

  //build y scales and axis
  var yAxis = d3.scaleBand()
    .range([h, 0])
    .domain(yAxisLabel)
    .padding(0.01);

   svg
     .append("g")
     .call(d3.axisLeft(yAxis));
  
  
  //build color scale
  var myColor = d3.scaleLinear().range(["White", "#69b3a2"]).domain([1, 100]);
  
  
  //Read the data
  d3.csv("data.csv", function (data) {
      svg.selectAll()
        .data(data, function (d) { return d.group + ':' + d.variable; })
        .enter()
        .append("rect")
        .attr("x", function (d) { return xAxis(d.group) })
        .attr("y", function (d) { return yAxis(d.variable) })
        .attr("width", xAxis.bandwidth())
        .attr("height", yAxis.bandwidth())
        .style("fill", function(d) { return myColor(d.value)})
    }
  );


}

window.onload = init;
