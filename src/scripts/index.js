import '../styles/index.scss';
import * as d3 from 'D3';

var neoAPI = require('./neo4jLoader.js');
var search = require('./search.js');

d3.select('.search-icon').on('click', () => {
    const value = (document.getElementById('search-bar')).value;
    search.searchById(value).then(d => console.log(d));
    neoAPI.addToGraph('CREATE (' + value + ':Node {name:"gene"})');
});

//neoAPI.findInGraph('MATCH (n:Answer) RETURN n');