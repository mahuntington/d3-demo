var WIDTH = 800;
var HEIGHT = 600;

var runs = [
    {
        id: 1,
        date: 'October 1, 2017 at 4:00pm',
        distance: 5.2
    },
    {
        id: 2,
        date: 'October 2, 2017 at 5:00pm',
        distance: 6.4
    },
    {
        id: 3,
        date: 'October 3, 2017 at 6:00pm',
        distance: 8.7
    }
]

d3.select('svg')
    .style('width', WIDTH)
    .style('height', HEIGHT);

var xScale = d3.scaleTime();
var parseTime = d3.timeParse("%B%e, %Y at%-I:%M%p");
xScale.range([0,WIDTH]);
xDomain = d3.extent(runs, function(datum, index){
    return parseTime(datum.date);
});
xScale.domain(xDomain);

var yScale = d3.scaleLinear();
yScale.range([HEIGHT, 0]);
yDomain = d3.extent(runs, function(datum, index){
    return datum.distance;
})
yScale.domain(yDomain);
var render = function(){

    d3.select('#points').html('');
    d3.select('#points').selectAll('circle')
        .data(runs)
        .enter()
        .append('circle');

    d3.selectAll('circle')
        .attr('cy', function(datum, index){
            return yScale(datum.distance);
        });

    d3.selectAll('circle')
        .attr('cx', function(datum, index){
            return xScale(parseTime(datum.date));
        });
    d3.selectAll('circle').on('click', function(datum, index){
        d3.event.stopPropagation();
        runs = runs.filter(function(run, index){
            return run.id != datum.id;
        });
        render();
        createTable();
    });

    var dragEnd = function(datum){
        var x = d3.event.x;
		var y = d3.event.y;

		var date = xScale.invert(x);
		var distance = yScale.invert(y);

		datum.date = formatTime(date);
		datum.distance = distance;
        createTable();
    }
    var drag = function(datum){
		var x = d3.event.x;
		var y = d3.event.y;
		d3.select(this).attr('cx', x);
		d3.select(this).attr('cy', y);
	}
    var dragBehavior = d3.drag()
        // .on('start', dragStart)
        .on('drag', drag)
        .on('end', dragEnd);
    d3.selectAll('circle').call(dragBehavior);
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

var formatTime = d3.timeFormat("%B%e, %Y at %-I:%M%p");
d3.select('svg').on('click', function(){
    var x = d3.event.offsetX;
    var y = d3.event.offsetY;

    var date = xScale.invert(x)
    var distance = yScale.invert(y);

    var newRun = {
        id: ( runs.length > 0 ) ? runs[runs.length-1].id+1 : 1,
        date: formatTime(date),
        distance: distance
    }
    runs.push(newRun);
    createTable();
    render();
});
