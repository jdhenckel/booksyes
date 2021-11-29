//called with /.netlify/functions/hasphoto
const axios = require('axios');
const helpers = require('./helperFuncs.js');

exports.handler = async function(event, context) {

    const endpoint = helpers.buildURL('select * where C is not null');

    return axios.get(endpoint, {headers: {'X-DataSource-Auth':""}})
    .then(response => ({
        statusCode: 200,
        body: helpers.buildBooks(response.data),
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }));
}