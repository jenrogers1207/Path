import '../styles/index.scss';
import * as d3 from 'D3';

var neoAPI = require('./neo4jLoader.js');
var search = require('./search.js');

d3.select('.search-icon').on('click', () => search.searchById());
//neoAPI.findInGraph('MATCH (n:Answer) RETURN n');