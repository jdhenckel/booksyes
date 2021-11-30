//called with /.netlify/functions/bycategory
const axios = require('axios');
const helpers = require('./helperFuncs.js');

exports.handler = async function(event, context) {

    const category = event.queryStringParameters.query;
    const endpoint = helpers.buildURL('select * where ' + helpers.categoryCol + ' = "' + category + '"', "books");

    return axios.get(endpoint, {headers: {'X-DataSource-Auth':""}})
    .then(response => ({
        statusCode: 200,
        body: helpers.buildBooks(response.data),
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }));
}