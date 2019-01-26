var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost:11016", neo4j.auth.basic("neo4j", "1234"));

export function addToGraph(query) {
    let command = 'CREATE (n:Gene {name:"' + query + '"})';
    var session = driver.session();
    session
        .run(command)
        .then(function(result) {
            session.close();
            checkForNode(query);
        })
        .catch(function(error) {
            console.log(error);
        });
}

export async function checkForNode(name) {
    var session = driver.session();
    let command = 'MATCH (n:Gene { name: "' + name + '" }) RETURN n';
    return session
        .run(command)
        .then(function(result) {
            session.close();
            return result.records;
        })
        .catch(function(error) {
            console.log(error);
        });
}

export function setNodeProperty(name, prop, propValue) {
    let command = 'MATCH (n:Gene { name: "' + name + '" }) SET n.' + prop + '= "' + propValue + '"';
    var session = driver.session();

    session
        .run(command)
        .then(function(result) {
            session.close();
        })
        .catch(function(error) {
            console.log(error);
        });
}

export async function getGraph() {
    console.log('getting graph');
    let command = 'MATCH (n:Gene) RETURN n ';
    var session = driver.session();

    return session
        .run(command)
        .then(function(result) {
            let nodes = result.records.map(r => r._fields);
            session.close();
            return nodes;
        })
        .catch(function(error) {
            console.log(error);
        });
}

export async function addPaths() {
    console.log('this is the paths');
}