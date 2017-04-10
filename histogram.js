//Assignment 2 
//set the margin, width and height for canvas 
var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//create a chart 
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//setting the x axis 
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);
	
//setting the y axis 
var y = d3.scale.linear()
    .range([height, 0]);

//Define the x axis 
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

//Define the y axis 
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
	

var bardata = [ ];	

// reading the histogramdata.tsv dataset 
d3.tsv("histogramdata.tsv", type, function(error, data) {
 
    //x and y deminsions 
    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);

    //located x and y axis 
    chart.append("g")
	   .attr("class", "axis")
	   .attr("transform", "translate(0," + height + ")")
	   .call(xAxis);

    chart.append("g")
	   .attr("class", "axis")
	   .call(yAxis);

    //create bars 
        chart.selectAll(".bar")
	   .data(data)
	   .enter().append("rect")
	   .attr("class", "bar")
	   .attr("x", function(d) { return x(d.name); }) //x position
	   .attr("y", function(d) { return y(d.count); })//y position
	   .attr("height", function(d) { return height - y(d.count)})//size of rect
	   .attr("width", x.rangeBand())
	   .text(function(d){return d.count}); //width
	   
	bardata = data;
});

function redraw(){
	chart.selectAll(".bar").remove();
		  chart.selectAll(".axis").remove();
		   
	//setting the domain for x and y dimensions 
    x.domain(bardata.map(function(d) { return d.name; }));
    y.domain([0, d3.max(bardata, function(d) { return d.count; })]);

	//located x and y axis 
    chart.append("g")
	   .attr("class", "axis")
	   .attr("transform", "translate(0," + height + ")")
	   .call(xAxis);

    chart.append("g")
	   .attr("class", "axis")
	   .call(yAxis);

    //Create bars
    chart.selectAll(".bar")
	   .data(bardata)
	   .enter().append("rect")
	   .attr("class", "bar")
	   .attr("x", function(d) { return x(d.name); }) //x position
	   .attr("y", function(d) { return y(d.count); })//y position
	   .attr("height", function(d) { return height - y(d.count)})//size of rect
	   .attr("width", x.rangeBand()); //width	
}

//setting the variable ascending order 
var ascending = false;

//functions by click axis switching 
d3.select("svg")
  .on("mousedown", function(){
	  var mouse_x = d3.mouse(this)[0];
	  var mouse_y = d3.mouse(this)[1];
	  ascending = !ascending;
	  if (mouse_x <= 40){
		  bardata.sort(function(a,b) {
            if(ascending) {
                return d3.ascending(a.count,b.count);
            } else {
               return d3.descending(a.count,b.count);
            }
	  })}
	  else if (mouse_y >= 470){
		  bardata.sort(function(a,b) {
            if(ascending) {
               return d3.ascending(a.name,b.name);
            } else {
               return d3.descending(a.name,b.name);
            }
        })
	  };
		redraw();
  }); 

function type(d) {
    d.count = +d.count; // coerce to count
    return d;
}
