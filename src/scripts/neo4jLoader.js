var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost:11001", neo4j.auth.basic("neo4j", "1234"));

export async function addToGraph(query, type) {
    let command = 'CREATE (n:' + type + ' {name:"' + query + '"})';
    console.log(command);
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
    let command = 'MATCH (n) RETURN n ';
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

export async function addRelation() {
    console.log('this is the paths');
    let command = 'MATCH (a:Gene),(b:Pathway) WHERE a.name = "' + gene + '" AND b.name = "' + path + '" CREATE (a)-[p:path]->(b) RETURN p';
}