import '../styles/index.scss';
import * as d3 from 'D3';

export function drawGraph(data) {
    console.log(data.nodes);

    let canvas = d3.select('#graph-render').select('.graph-canvas'),
        width = +canvas.attr("width"),
        height = +canvas.attr("height"),
        radius = 20;

    let simulation = d3.forceSimulation()
        .velocityDecay(0.1)
        .force("x", d3.forceX(width / 2).strength(.05))
        .force("y", d3.forceY(height / 2).strength(.05))
        .force("charge", d3.forceManyBody().strength(-100))
        .force('center', d3.forceCenter(300, 250))
        .force("link", d3.forceLink().distance(50).strength(1));

    var link = canvas.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append("line")
        .attr("stroke-width", 1)
        .attr('stroke', '#9999');

    let node = canvas.select('.nodes').selectAll('g').data(data.nodes);

    let nodeEnter = node
        .enter().append("g")
        .attr("class", d => {
            return "node " + d.label;
        });
    // .classed('circle-group', true);

    let circles = nodeEnter.append('circle')
        //.attr("r", radius - .75)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    let labels = nodeEnter.append('text').text(d => d.title).attr("transform", "translate(-18,2)");

    node = nodeEnter.merge(node);
    node.exit().remove();




    node.on('click', (d) => {
        console.log(d.title);
    });

    simulation
        .nodes(data.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(data.links);

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
        link.attr("x1", d => {
            return d.source.x;
        }).attr("y1", d => {
            return d.source.y;
        }).attr("x2", d => {
            return d.target.x;
        }).attr("y2", d => {
            return d.target.y;
        });
        node
            .attr("transform", function(d) { return "translate(" + d.x + ", " + d.y + ")"; });

    }

}