var WIDTH = 800;
var HEIGHT = 600;

var runs = [
    {
        id: 1,
        date: 'October 1, 2017',
        distance: 5.2
    },
    {
        id: 2,
        date: 'October 2, 2017',
        distance: 6.4
    },
    {
        id: 3,
        date: 'October 3, 2017',
        distance: 8.7
    }
]

d3.select('svg')
    .style('width', WIDTH)
    .style('height', HEIGHT);

var xScale = d3.scaleTime();
var yScale = d3.scaleLinear();
var render = function(){

    yScale.range([HEIGHT, 0]);
    yDomain = d3.extent(runs, function(datum, index){
        return datum.distance;
    })
    yScale.domain(yDomain);

    d3.select('svg').selectAll('circle')
        .data(runs)
        .enter()
        .append('circle');

    d3.selectAll('circle')
        .attr('cy', function(datum, index){
            return yScale(datum.distance);
        });

    var parseTime = d3.timeParse("%B%e, %Y");
    xScale.range([0,WIDTH]);
    xDomain = d3.extent(runs, function(datum, index){
        return parseTime(datum.date);
    });
    xScale.domain(xDomain);

    d3.selectAll('circle')
        .attr('cx', function(datum, index){
            return xScale(parseTime(datum.date));
        });

}
render();

var bottomAxis = d3.axisBottom(xScale);
d3.select('svg')
	.append('g')
	.call(bottomAxis)
    .attr('transform', 'translate(0,'+HEIGHT+')');

var leftAxis = d3.axisLeft(yScale);
d3.select('svg')
	.append('g')
	.call(leftAxis);

var createTable = function(){
    d3.select('tbody').html('');
    for (var i = 0; i < runs.length; i++) {
        var row = d3.select('tbody').append('tr');
        row.append('td').html(runs[i].id);
        row.append('td').html(runs[i].date);
        row.append('td').html(runs[i].distance);
    }
}

createTable();

var formatTime = d3.timeFormat("%B%e, %Y");
d3.select('svg').on('click', function(){
    var x = d3.event.offsetX;
    var y = d3.event.offsetY;

    var date = xScale.invert(x)
    var distance = yScale.invert(y);

    var newRun = {
        id: runs[runs.length-1].id+1,
        date: formatTime(date),
        distance: distance
    }
    runs.push(newRun);
    createTable();
    render();
});
