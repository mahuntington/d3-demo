var WIDTH = 800;
var HEIGHT = 600;

var runs = [
    {
        id: 1,
        date: 'October 1, 2017 at 4:00PM',
        distance: 5.2
    },
    {
        id: 2,
        date: 'October 2, 2017 at 5:00PM',
        distance: 7.0725
    },
    {
        id: 3,
        date: 'October 3, 2017 at 6:00PM',
        distance: 8.7
    }
];

var render = function(){

    var circles = d3.select('#points').selectAll('circle').data(runs, function(datum){ //when redrawing circles, make sure pre-existing circles match with their old data
        return datum.id
    });

    circles.enter()
        .append('circle')
        .attr('cy', function(datum, index){
            return yScale(datum.distance);
        })
        .attr('cx', function(datum, index){
            return xScale(parseTime(datum.date));
        });

    circles.exit().remove();

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

var createTable = function(){
    d3.select('tbody').html('');
    for (var i = 0; i < runs.length; i++) {
        var row = d3.select('tbody').append('tr');
        row.append('td').html(runs[i].id);
        row.append('td').html(runs[i].date);
        row.append('td').html(runs[i].distance);
    }
}

var zoomCallback = function(){
    lastTransform = d3.event.transform;
	d3.select('#points').attr("transform", d3.event.transform);
    d3.select('#x-axis').call(bottomAxis.scale(d3.event.transform.rescaleX(xScale)));
	d3.select('#y-axis').call(leftAxis.scale(d3.event.transform.rescaleY(yScale)));
}

var init = function(){
    d3.select('#container')
        .style('width', WIDTH)
        .style('height', HEIGHT);

    xScale.range([0,WIDTH]);
    xDomain = d3.extent(runs, function(datum, index){
        return parseTime(datum.date);
    });
    xScale.domain(xDomain);

    yScale.range([HEIGHT, 0]);
    yDomain = d3.extent(runs, function(datum, index){
        return datum.distance;
    })
    yScale.domain(yDomain);
    render();

    d3.select('#container')
    	.append('g')
        .attr('id', 'x-axis')
    	.call(bottomAxis)
        .attr('transform', 'translate(0,'+HEIGHT+')');

    d3.select('#container')
    	.append('g')
        .attr('id', 'y-axis')
    	.call(leftAxis);

    createTable();

    d3.select('#container').on('click', function(){
        var x = d3.event.offsetX;
    	var y = d3.event.offsetY;

    	if(lastTransform !== null){
    		x = lastTransform.invertX(d3.event.offsetX);
    		y = lastTransform.invertY(d3.event.offsetY);
    	}

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

    d3.select('#container').call(zoom);
}

var xScale = d3.scaleTime();
var parseTime = d3.timeParse("%B%e, %Y at %-I:%M%p");
var yScale = d3.scaleLinear();
var bottomAxis = d3.axisBottom(xScale);
var leftAxis = d3.axisLeft(yScale);
var formatTime = d3.timeFormat("%B%e, %Y at %-I:%M%p");
var lastTransform = null;
var zoom = d3.zoom().on('zoom', zoomCallback);

init();
