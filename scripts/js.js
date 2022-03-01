
var h = 100;
var w = 400;



//call to load data and then build our viz
d3.json("MonthlySalesbyCategoryMultiple.json", function (error, data) {

    //check the file loaded properly
    if (error) {  //is there an error?
        console.log(error);  //if so, log it to the console
    } else {      //If not we're golden!
        console.log(data);   //Now show me the money!
    }

    data.contents.forEach(function(ds){
        console.log(ds);
        showHeader(ds);
        buildLine(ds);
    })

});

function showHeader(ds){
    d3.select("body").append("h1")
    .text(ds.category + " Sales (2013)");
}

function buildLine(ds) {

    var lineFun = d3.svg.line()
        .x(function (d) { return ((d.month - 20130001) / 3.25); })
        .y(function (d) { return h - d.sales; })
        .interpolate("linear");

    var svg = d3.select("body").append("svg").attr({ width: w, height: h });

    var viz = svg.append("path")
        .attr({
            d: lineFun(ds.monthlySales),
            "stroke": "purple",
            "stroke-width": 2,
            "fill": "none"
        });
}