import '../styles/index.scss';
import * as d3 from 'D3';

export function drawGraph(data) {
    console.log(data);

    let canvas = d3.select('#graph-render').select('.graph-canvas'),
        width = +canvas.attr("width"),
        height = +canvas.attr("height"),
        radius = 20;

    let simulation = d3.forceSimulation()
        .velocityDecay(0.1)
        .force("x", d3.forceX(width / 2).strength(.05))
        .force("y", d3.forceY(height / 2).strength(.05))
        .force("charge", d3.forceManyBody().strength(-100))
        .force('center', d3.forceCenter(200, 200))
        .force("link", d3.forceLink().distance(50).strength(1));

    let node = canvas.select('.nodes');
    node.exit().remove();

    let nodeEnter = node.selectAll('g')
        .data(data)
        .enter().append("g");

    let circles = nodeEnter.append('circle')
        .attr("r", radius - .75)
        .style('fill', 'red')
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    let labels = nodeEnter.append('text').text(d => d[0].properties.name);

    node = nodeEnter.merge(node);

    node.on('click', (d) => {
        console.log(d[0].properties);
    });
    // node = nodeEnter.merge(node);

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
        /*
                node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
                    .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });*/

        node
            .attr("transform", function(d) { return "translate(" + d.x + ", " + d.y + ")"; });


    }

}