import '../styles/index.scss';
import * as d3 from 'D3';

export function drawGraph(data) {
    console.log(data);

    let canvas = d3.select('#graph-render').select('.graph-canvas'),
        width = +canvas.attr("width"),
        height = +canvas.attr("height"),
        radius = 20;

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; })
            .distance(100).strength(1))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));


    var node = canvas.select('.nodes')
        .selectAll('.nodes-c')
        .data(data);

    node.exit().remove();

    let nodeEnter = node.enter().append("g").classed('nodes-c', true);

    var circles = nodeEnter.append("circle")
        .attr("r", 10)
        // .attr("fill", function(d) { return color(d.group); })
        .attr('fill', 'red')
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node = nodeEnter.merge(node);

    simulation
        .nodes(data)
        .on("tick", ticked);

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(1);
        d.fx = null;
        d.fy = null;
    }

    function ticked() {


        node
            .attr("transform", function(d) { return "translate(" + d.x + ", " + d.y + ")"; });

    }

}