import * as d3 from 'D3';
const qo = require('./queryObject.js');
const neoAPI = require('./neo4jLoader.js');

const xhr = require('nets');

export async function searchById(value) {
    const proxy = 'https://cors-anywhere.herokuapp.com/';

    d3.select('#linked-pathways').selectAll('*').remove();
    d3.select('#pathway-render').selectAll('*').remove();
    d3.select('#assoc-genes').selectAll('*').remove();
    d3.select('#gene-id').selectAll('*').remove();

    let query = new qo.QueryObject(value);

    if (value.includes(':')) {
        if (value.includes('ncbi-geneid')) {
            convert_id(value);
        } else {
            linkData([value]);
        }
    } else {
        let url = 'http://mygene.info/v3/query?q=' + value;

        return xhr({
                url: proxy + url,
                method: 'GET',
                encoding: undefined,
                headers: {
                    "Content-Type": "application/json"
                }
            },
            function done(err, resp, body) {

                if (err) {
                    console.error(err);
                    return;
                }

                let geneID = d3.select('#gene-id');
                let json = JSON.parse(resp.rawRequest.responseText);

                let props = json.hits[0];
                let properties = { 'symbol': props.symbol, 'ncbi': props._id, 'entrezgene': props.entrezgene, 'description': props.name };

                neoAPI.checkForNode(value).then(found => {
                    if (found.length > 0) {
                        for (let prop in properties) {
                            neoAPI.setNodeProperty(value, prop, properties[prop]);
                        }
                    };
                });

                convert_id('ncbi-geneid:' + properties.ncbi);
            });
    }
}

//Formater for CONVERT. Passed as param to query
async function convert_id(id) {
    //NEED TO MAKE THIS SO IT CAN USE OTHER IDS
    let stringArray = new Array();
    let type = 'genes/';
    let url = 'http://rest.kegg.jp/conv/' + type + id;

    const proxy = 'https://cors-anywhere.herokuapp.com/';

    return xhr({
            url: proxy + url,
            method: 'GET',
            encoding: undefined,
            headers: {
                "Content-Type": "text/plain"
            }
        },
        function done(err, resp, body) {
            if (err) {
                console.error(err);
                return;
            }

            // v this consoles what I want v 
            grabId(resp.rawRequest.responseText).then(ids => {
                console.log(ids);

                linkData(ids);
            });

            // let json = JSON.parse(resp.rawRequest.responseText);
            // console.log(json);
            return resp;
        }

    );
    // v this throws cannot reads responseText of undefined what v 
    //console.log(data);

    //  return data;
}


function get_format(id, geneId) {
    let url = 'http://rest.kegg.jp/get/' + id + '/kgml';
    let proxy = 'https://cors-anywhere.herokuapp.com/';

    let data = xhr({
            url: proxy + url,
            method: 'GET',
            encoding: undefined,
            headers: {
                "Content-Type": "application/json"

            }
        },
        function done(err, resp, body) {

            if (err) {
                console.error(err);
                return;
            }

            /*
            pathways.pathProcess(resp.rawRequest.responseXML, geneId).then(p => {
                console.log(p);
                pathways.pathRender(p)
            });
            */
        });
}

//Formater for CONVERT. Passed as param to query
function conv_format(id) {
    //NEED TO MAKE THIS SO IT CAN USE OTHER IDS
    let stringArray = new Array();
    let type = 'genes/';
    let url = 'http://rest.kegg.jp/conv/' + type + id;

    let proxy = 'https://cors-anywhere.herokuapp.com/';

    let data = xhr({
            url: proxy + url,
            method: 'GET',
            encoding: undefined,
            headers: {
                "Content-Type": "text/plain"
            }
        },

        function done(err, resp, body) {
            if (err) {
                console.error(err);
                return;
            }

            // v this consoles what I want v 
            grabId(resp.rawRequest.responseText).then(ids => link_format(ids));

            return resp;
        }

    );
    // v this throws cannot reads responseText of undefined what v 
    console.log(data);

    return data;
}

async function grabId(list) {
    let stringArray = new Array();

    list = list.split(/(\s+)/);

    for (var i = 0; i < list.length; i++) {
        if (list[i].length > 1) {
            stringArray.push(list[i]);
        }
    };

    return stringArray;
}

function renderText(idArray, response) {

    let splits = grabId(response);
    let id_link = splits[0];
    splits = splits.filter(d => d != id_link);

    let divID = d3.select(document.getElementById('gene-id'));
    divID.selectAll('*').remove();

    let divLink = d3.select(document.getElementById('linked-pathways'));
    divLink.selectAll('*').remove();

    divLink.append('div').append('h2').text('Associated Pathways: ');
    if (idArray.length > 1) {
        divID.append('span').append('text').text('Search ID:');
        divID.append('text').text(idArray[0] + '   ');

    }
    divID.append('span').append('text').text('Kegg ID:');
    divID.append('text').text(id_link);

    let div = divLink.selectAll('div').data(splits);
    div.exit().remove();
    let divEnter = div.enter().append('div').classed('path-link', true);
    div = divEnter.merge(div);

    let text = divEnter.append('text').text(d => d);
    text.on('click', (id) => get_format(id, id_link));

}

//Formater for LINK. Passed as param to query
function link_format(idArray) {
    let keggId = null;

    keggId = (idArray.length > 1) ? idArray[1] : idArray[0];

    let url = 'http://rest.kegg.jp/link/pathway/' + keggId;
    let proxy = 'https://cors-anywhere.herokuapp.com/';

    let data = xhr({
            url: proxy + url,
            method: 'GET',
            encoding: undefined,
            headers: {
                "Content-Type": "text/plain"
            }
        },
        function done(err, resp, body) {
            if (err) {
                console.error(err);
                return;
            }
            console.log(resp.rawRequest.responseText);
            // v this consoles what I want v 
            // renderText(idArray, resp.rawRequest.responseText);

            return resp;
        }

    );
    // v this throws cannot reads responseText of undefined what v 
    console.log(data);

    return data;

}

//Formater for LINK. Passed as param to query
async function linkData(idArray) {

    let keggId = null;

    keggId = (idArray.length > 1) ? idArray[1] : idArray[0];

    let url = 'http://rest.kegg.jp/link/pathway/' + keggId;
    const proxy = 'https://cors-anywhere.herokuapp.com/';

    let data = xhr({
            url: proxy + url,
            method: 'GET',
            encoding: undefined,
            headers: {
                "Content-Type": "text/plain"
            }
        },
        await
        function(err, resp, body) {
            if (err) {
                console.error(err);
                return;
            }

            let splits = grabId(resp.rawRequest.responseText).then(d => {
                console.log('is this happening?');
                console.log(d);
                let id_link = d[0];
                let splits = d.filter(d => d != id_link);
                console.log(splits);
            });

            return resp;
        }
    );

    return data;

}