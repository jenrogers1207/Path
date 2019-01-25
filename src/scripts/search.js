import * as d3 from 'D3';

const xhr = require('nets');
//const dm = new DM.DataManager();
//const queryAPI = DM.default;

export function searchById() {
    const proxy = 'https://cors-anywhere.herokuapp.com/';

    d3.select('#linked-pathways').selectAll('*').remove();
    d3.select('#pathway-render').selectAll('*').remove();
    d3.select('#assoc-genes').selectAll('*').remove();
    d3.select('#gene-id').selectAll('*').remove();

    d3.select('#thinking').classed('hidden', false);

    const value = (document.getElementById('search-bar')).value;
    if (value.includes(':')) {
        if (value.includes('ncbi-geneid')) {
            convert_id(value);
        } else {
            linkData([value]);
        }
    } else {
        let url = 'http://mygene.info/v3/query?q=' + value;


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
                d3.select('#thinking').classed('hidden', true);
                let geneID = d3.select('#gene-id');
                let header = geneID.append('h2').text('Did you mean :');
                let json = JSON.parse(resp.rawRequest.responseText);
                /*
                 let matchArray = json.hits;
                 json.hits.forEach((hit, i) => {
                     let name = hit.name;
                     let finds = matchArray.map(d=> d.name);
                     if(finds.indexOf(name) ==  -1){ matchArray.push(hit)}
                 });
                */
                let matchArray = new Array(json.hits[0]);


                if (json.hits.length > 1) {
                    matchArray.push(json.hits[1]);
                }


                let options = geneID.selectAll('.gene_link').data(matchArray);
                let optionsEnter = options.enter().append('div').classed('gene_link', true);
                options = optionsEnter.merge(options);
                let link = options.append('h5').text(d => d.symbol);
                let description = options.append('text').text(d => ' ' + d.name);

                link.on('click', (d) => {
                    convert_id('ncbi-geneid:' + d._id);
                });

            });
    }
}

//Formater for CONVERT. Passed as param to query
function convert_id(id) {
    //NEED TO MAKE THIS SO IT CAN USE OTHER IDS
    let stringArray = new Array();
    let type = 'genes/';
    let url = 'http://rest.kegg.jp/conv/' + type + id;

    const proxy = 'https://cors-anywhere.herokuapp.com/';

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
            d3.select('#thinking').classed('hidden', true);
            // v this consoles what I want v 
            grabId(resp.rawRequest.responseText).then(ids => linkData(ids));

            return resp;
        }

    );
    // v this throws cannot reads responseText of undefined what v 
    console.log(data);

    return data;
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

function grabId(list) {
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

            // v this consoles what I want v 
            renderText(idArray, resp.rawRequest.responseText);

            return resp;
        }

    );
    // v this throws cannot reads responseText of undefined what v 
    console.log(data);

    return data;

}