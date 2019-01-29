export class QueryObject {
    constructor(queryVal) {

        this.symbol = '';
        this.name = queryVal;
        this.ncbi = '';
        this.keggId = '';
    }
}

export class SelectedQuery {
    constructor(queryOb) {

        this.queryOb = queryOb;
    }
}

export const SelectedTest = new SelectedQuery(null);