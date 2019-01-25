var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost:11010", neo4j.auth.basic("neo4j", "1234"));

export function findInGraph(query) {

    // Create a session to run Cypher statements in.
    // Note: Always make sure to close sessions when you are done using them!
    var session = driver.session();

    // the Promise way, where the complete result is collected before we act on it:
    session
    //.run('MERGE (james:Person {name : {nameParam} }) RETURN james.name AS name', {nameParam: 'James'})
        .run(query)
        .then(function(result) {
            result.records.forEach(function(record) {
                console.log(record);
            });
            session.close();
        })
        .catch(function(error) {
            console.log(error);
        });

}

export function addToGraph(addition) {
    console.log(addition);
    let command = 'CREATE (n:Node {id:{" ' + addition + ' "}, data:{data}})';
    var session = driver.session();
    session
        .run(addition)
        .then(function(result) {

            session.close();
        })
        .catch(function(error) {
            console.log(error);
        });
}