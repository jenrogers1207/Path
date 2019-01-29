import '../styles/index.scss';
import * as d3 from 'D3';
const gCanvas = require('./graphRender.js');
var neoAPI = require('./neo4jLoader.js');
var search = require('./search.js');

d3.select('.search-icon').on('click', () => {
    const value = (document.getElementById('search-bar')).value;
    neoAPI.checkForNode(value).then(found => {
        if (found.length > 0) {
            console.log("already exists");
        } else {
            neoAPI.addToGraph(value, 'Gene');
        }
        search.searchById(value).then(() => neoAPI.getGraph().then(g => gCanvas.drawGraph(g)));

    });
});

let canvas = d3.select('#graph-render').append('svg').classed('graph-canvas', true);
let linkGroup = canvas.append('g').classed('links', true);
let nodeGroup = canvas.append('g').classed('nodes', true);

neoAPI.getGraph().then(g => gCanvas.drawGraph(g));