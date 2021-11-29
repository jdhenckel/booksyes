//called with /.netlify/functions/search
const axios = require('axios');

exports.handler = async function(event, context) {

    buildBooks = (data) => {
        const table = JSON.parse(data).table;
        const retObj = {books: []};
        for (let r = 0; r < table.rows.length; r++) {
            const row = table.rows[r];
            const book = {id: r};

            for (let i = 0; i < table.cols.length; i++) {
                const col = table.cols[i];
                const valueSet = JSON.parse('{"' + col.label + '": "' + (row.c[i]?.f ?? row.c[i]?.v) + '"}');
                Object.assign(book, valueSet);
            }

            retObj.books.push(book);
        }

        return JSON.stringify(retObj);
    };

    buildQuery = (searchTerms) => {
        const terms = searchTerms.split(" ");
        var queryString = "select * ";
        if(searchTerms == "") return queryString;
        for (let i = 0; i < terms.length; i++) {
            if(i != 0 && i < terms.length) { //not the first or last
                queryString += "or ";
            }
            const term = terms[i].toLowerCase();
            queryString += 'where "search" contains "' + term + '" ';
        }

        return queryString;
    };

    const {DATABASE_LOCATION} = process.env;
//https://docs.google.com/spreadsheets/d/1fMRI2ZURf6op-fd3SYvv-BKKdMvO4O5nre9xUFObU5c/gviz/tq?tq=select%20*
    const request = "/gviz/tq?tq=";
    const query = buildQuery(event.queryStringParameters.query ?? "");
    
    const endpoint = DATABASE_LOCATION + request + query;

    return axios.get(endpoint, {headers: {'X-DataSource-Auth':""}})
    .then(response => response.data)
    .then(data => ({
        statusCode: 200,
        body: buildBooks(data.replace(/^\)]\}'\n/, '')),
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }));
}