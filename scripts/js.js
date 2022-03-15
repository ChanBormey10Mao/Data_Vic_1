

//Width and height
var margin = 30;
var w = 1080;
var h = 700;

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


//slider
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}