import { parse } from "./parse.js";

// set the dimensions and margins of the graph
var margin = {top: 80, right: 25, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.json(await parse(), function(data) {

// Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
    var myGroups = d3.map(data, function(d){return d.winning_score;}).keys()
    var myVars = d3.map(data, function(d){return d.losing_score;}).keys()

    console.log(function(d){return d.winning_score;});

    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(myGroups)
        .padding(0.05);
    svg.append("g")
        .style("font-size", 15)
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .select(".domain").remove()

// Build Y scales and axis:
    var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(myVars)
        .padding(0.05);
    svg.append("g")
        .style("font-size", 15)
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove()

// Build color scale
    var myColor = d3.scaleSequential()
        // .interpolator(d3.interpolate("#f58025", "black"))
        .interpolator(d3.interpolate("orange", "#e60e11"))
        .domain([1, 10])

// create a tooltip
    var tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

// Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function() {
        tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    var mousemove = function(d) {
        tooltip
            .html("The first game with this score is: " + d.firstGame)
            .style("left", (d3.mouse(this)[0]+70) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function() {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    }

// add the squares
    svg.selectAll()
        .data(data, function(d) {return d.winning_score+':'+d.losing_score;})
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.winning_score) })
        .attr("y", function(d) { return y(d.losing_score) })
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .style("fill", function(d) { 
            if(d.count == -1) return "black";
            else if(d.count == 0) return "white";
            else return myColor(d.count)
        } )
        .style("stroke-width", 4)
        .style("stroke", "none")
        .style("opacity", 0.8)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
})

// Add title to graph
svg.append("text")
    .attr("x", 0)
    .attr("y", -50)
    .attr("text-anchor", "left")
    .style("font-size", "22px")
    .text("Princeton Scorigami");

// Add subtitle to graph
svg.append("text")
    .attr("x", 0)
    .attr("y", -20)
    .attr("text-anchor", "left")
    .style("font-size", "14px")
    .style("fill", "grey")
    .style("max-width", 400)
    .text("A short description of the take-away message of this chart.");

