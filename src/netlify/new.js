//called with /.netlify/functions/new
const axios = require('axios');
const helpers = require('./helperFuncs.js');

exports.handler = async function(event, context) {

    const endpoint = helpers.buildURL('select * where ' + helpers.isNewCol + ' = TRUE', "books");

    return axios.get(endpoint, {headers: {'X-DataSource-Auth':""}})
    .then(response => ({
        statusCode: 200,
        body: helpers.buildBooks(response.data),
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }));
}