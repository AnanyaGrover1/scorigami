import { parse } from "./parse.js";

// set the dimensions and margins of the graph
var margin = {top: 20, right: 25, bottom: 30, left: 40},
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
        .style("font-size", 8)
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .select(".domain").remove();
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height + 25)
        .text("Winning Team Score");
    

// Build Y scales and axis:
    var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(myVars)
        .padding(0.05);
    svg.append("g")
        .style("font-size", 8)
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove()
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -height/2 + height/10)
        .attr("y", -30)
        .attr("dy", "0.75em")
        .attr("transform", "rotate(-90)")
        .text("Losing Team Score");

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
        .style("background-color", "black")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("border-color", "black")
        .style("padding", "5px")
        .style("position", "absolute")
        .style("color", "white")
        .style("pointer-events", "none")
        .style("max-width", "400px")

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
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px")

        if(d.count > 1) {
        tooltip
            .html("The first game with this score is: " + d.firstGame + ", and the last game is " + d.lastGame) 
            
        }else if(d.count == 1) {
            tooltip
            .html("The first game with this score is: " + d.firstGame)

        } else if(d.count == 0) {
            tooltip
            .html("There has been no game with the score " + d.winning_score+':'+d.losing_score + " yet!")

        } else {
            tooltip
            .html("This score is impossible!")
        }

    }
    var mouseleave = function() {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    }

// add the squares
var squares = svg.selectAll()
        .data(data, function(d) {return d.winning_score+':'+d.losing_score;})
        .enter().append("g")

var rectangles = squares.append("rect")
        .attr("x", function(d) { return x(d.winning_score) })
        .attr("y", function(d) { return y(d.losing_score) })
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .style("fill", function(d) { 
            if(d.count == -1) return "black";
            else if(d.count == 0) return "#f5f5f5";
            else return myColor(d.count)
        } )
        .style("stroke-width", 1)
        .style("stroke", "none")
        .style("opacity", 0.8)
// this adds box labels
    // squares.append("text")
    //     .style("font-size", 10)
    //     .attr("x", function(d) { return x(d.winning_score) + x.bandwidth() / 2})
    //     .attr("y", function(d) { return y(d.losing_score) + y.bandwidth() - 2})
    //     .style("text-anchor", "middle")
    //     .style("fill", "white")
    //     .text(function(d) { if(d.count > 0) return d.count; })
    //     .style("pointer-events", "none")

    rectangles
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
})

