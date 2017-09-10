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

var yScale = d3.scaleLinear();
yScale.range([HEIGHT, 0]);
yScale.domain([0, 10]);

d3.selectAll('circle').data(runs)
    .attr('cy', function(datum, index){
        return yScale(datum.distance);
    });

var xScale = d3.scaleTime();
xScale.range([0,WIDTH]);
xScale.domain([new Date('2017-10-1'), new Date('2017-10-31')]);

var parseTime = d3.timeParse("%B%e, %Y");
d3.selectAll('circle')
    .attr('cx', function(datum, index){
        return xScale(parseTime(datum.date));
    });
