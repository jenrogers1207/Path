import '../styles/index.scss';

var neoAPI = require('./neo4jLoader.js');

neoAPI.findInGraph('MATCH (n:Answer) RETURN n');