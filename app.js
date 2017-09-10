var WIDTH = 800;
var HEIGHT = 600;

var runs = [
    {
        id: 1,
        date: '10/1/2017',
        distance: 5.2
    },
    {
        id: 2,
        date: '10/2/2017',
        distance: 6.4
    },
    {
        id: 3,
        date: '10/3/2017',
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

console.log(xScale.domain());
console.log(xScale.range());
