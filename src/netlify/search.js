//called with /.netlify/functions/search
const axios = require('axios');
const helpers = require('./helperFuncs.js');

exports.handler = async function(event, context) {

    buildQuery = (searchTerms) => {
        const terms = searchTerms.split(" ");
        var queryString = "select * ";
        if(searchTerms == "") return queryString;
        for (let i = 0; i < terms.length; i++) {
            if(i != 0 && i < terms.length) { //not the first or last
                queryString += "or ";
            }
            const term = terms[i].toLowerCase();
            queryString += 'where A contains "' + term + '" ';
        }

        return queryString;
    };

    const endpoint = helpers.buildURL(buildQuery(event.queryStringParameters.query ?? ""));

    return axios.get(endpoint, {headers: {'X-DataSource-Auth':""}})
    .then(response => ({
        statusCode: 200,
        body: helpers.buildBooks(response.data),
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }));
}